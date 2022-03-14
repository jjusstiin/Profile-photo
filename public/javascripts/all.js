//上傳圖片到canvas 
    function fileUpLoad(_this){
        let file = _this.files[0];
        console.log(file);
        // if(!/image\/\w+/.test(file.type)){ //html中已經用accept='image/*'限制上傳的是圖片了，此處判斷可省略
        //     alert("檔案必須為圖片!"); 
        //     return false; 
        // } 
        // if(!FileReader){
        // 	alert("你的瀏覽器不支援H5的FileReader");
        // 	ipt.setAttribute("disabled","disabled");//瀏覽器不支援禁用input type='file'檔案上傳標籤
        // 	return;
        // }
        let fileReader = new FileReader();
        fileReader.readAsDataURL(file); //將檔案讀取為Data URL 讀取結果放在result中
        fileReader.onload = function(e){
            drawToCanvas(this.result);  //畫到canvas裡
            // console.log(this.result);
        }
    }

//開始畫布
const c = document.getElementById("imgFrame");
let ctx = c.getContext('2d');
circle();//出現圓圈頭像範圍

let img;//被上傳的圖片  
let xSet;//照片放置的X位置
let ySet;//照片放置的Y位置
let scale = 1;//照片比例
let sizeOfLongImg = 800;  //圖片不大於最大邊長
let sizeOfshortImg = 400;  //圖片不小於最小邊長
function drawToCanvas(imgData){
    img = new Image;
    img.src = imgData;
    img.onload = function(){    //必須onload之後再畫
        let imgWidth = img.width 
        let imgHeight = img.height
            //先讓長邊符合比例
            if (imgWidth > sizeOfLongImg ||  imgHeight > sizeOfLongImg) {
                if (imgWidth > imgHeight) {
                    scale = sizeOfLongImg / imgWidth;
                }else {
                    scale = sizeOfLongImg / imgHeight;
                }
            }
            imgWidth = imgWidth * scale;  // 計算等比縮小後圖片
            imgHeight  = imgHeight * scale;
            
            //先讓短編邊符合比例
            if(imgWidth < sizeOfshortImg || imgHeight < sizeOfshortImg){
                    if (imgWidth > imgHeight) {
                        scale = sizeOfshortImg/imgHeight;
                    }else {
                        scale = sizeOfshortImg/imgWidth;
                    }
                }else{
                    scale = 1;
                }
            ctx.width = imgWidth * scale;  // 計算等比縮小後圖片
            ctx.height = imgHeight * scale; 

        //圖片初始放置 x, y 
        xSet = (c.width - ctx.width) / 2;
        ySet = (c.height - ctx.height) / 2;

        ctx.drawImage(img, xSet, ySet, ctx.width, ctx.height);  // 圖片載入
    }
    
}

//拖曳圖片
let pos={}, posl ={};   //原位置，新位置
c.onmousedown = function(e){
    if(!img){return}
    pos = {x:e.clientX - xSet, y:e.clientY - ySet};
    // console.log(pos);
    
    c.onmousemove = function (e) {
        posl ={x:e.clientX, y:e.clientY};
        // console.log(posl);
        var x = posl.x - pos.x, y = posl.y - pos.y;
        xSet = x;
        ySet = y;
        // pos = JSON.parse(JSON.stringify(posl));
        ctx.clearRect(0,0, ctx.width, ctx.height);
        circle();
        ctx.drawImage(img,xSet,ySet,ctx.width,ctx.height); //重新繪製圖片

        c.onmouseleave = function(){
            c.onmousemove = null;
            imgNoOver();
        }
    }
    c.onmouseup = function(){
            c.onmousemove = null;
            imgNoOver();
        }
}

//讓圖片保持在範圍內 
function imgNoOver(){
    ctx.clearRect(0,0, ctx.width, ctx.height);
    circle();
        if(xSet > 0 ){
            xSet = 0
        }else if(xSet < -(ctx.width-c.width)){
            xSet = -(ctx.width-c.width)
        }
        if(ySet > 0 ){
            ySet = 0
        }else if(ySet < -(ctx.height-c.height)){
            ySet = -(ctx.height-c.height)
        }
        ctx.drawImage(img,xSet,ySet,ctx.width,ctx.height);
}

//頭像範圍
function circle(){ 
    // context.strokeStyle = 'none';
    ctx.arc(200, 200, 200, 2 * Math.PI, false); // x軸, y軸, 半徑, 路徑.5啪開始, 路徑2啪結束, true，逆時針繪圆弧
    ctx.stroke(); //畫出
    ctx.globalCompositeOperation = 'destination-over';//先畫的在前面
}

//取出profile icon
function cutProfile(){
    let cProfile = profile.getContext("2d");
    cProfile.clearRect(0,0, ctx.width, ctx.height);
    cProfile.arc(150, 150, 120, 2 * Math.PI, false);
    cProfile.stroke();
    cProfile.globalCompositeOperation = 'destination-over';
    cProfile.clip();
    cProfile.drawImage(imgFrame, 0, 0,300,300);
    let dprofile = document.getElementById("profile");
    let dataURL = dprofile.toDataURL("image/jpeg");
    console.log(dataURL); 
    $('#showName').text($('#inputName').val())     
}

//照相取照片
$('#takeAPic').on('click',function(){

    // WebCam 啟動程式
    Webcam.set({
        width: 600,
        height: 400,
        image_format: 'jpeg',
        jpeg_quality: 90
    });
    Webcam.attach('#cameraDiv');

    $("#okButton").on("click", function () {
        Webcam.snap(function (snappedImage) {
            // console.log(snappedImage);
            ctx.clearRect(0,0, ctx.width, ctx.height);
            drawToCanvas(snappedImage);
            Webcam.reset();
        }); // End of Webcam.snap
    });
})