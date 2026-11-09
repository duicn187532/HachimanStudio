/* 原專案 static/mainController.js。作品集示範版的改動：
   - getData 改讀 questions.js（原版向 Flask 的 /json 取題目）
   - saveData 不送出（原版 POST 到 /saveData 存進 MongoDB）
   - 新增 makePlace、renderEnd（原版由 Flask 與 Jinja 範本產生）
   - 圓餅圖標籤改為匿名的候選人 A／B／C */

function makePlace(){
    let finList=[[1],[2],[3]];
    for(let r=0;r<10;r++){
        let listR=[1,2,3].sort(()=>Math.random()-0.5);
        for(let n=0;n<3;n++) finList[n].push(listR[n]);
    }
    return finList;
}

function renderEnd(){
    const box = document.querySelector(".endBox");
    const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
    box.innerHTML = window.VR_QUESTIONS.map(i =>
        '<div class="end" style="display: none;">' +
        '<div class="resultTopic">' + esc(i.Q) + '</div><div class="topic-list"><ul>' +
        '<div style="display: flex;"><div class="men a">A</div><li class="selectEnd">' + esc(i.option1All) + '</li></div>' +
        '<div style="display: flex;"><div class="men b">B</div><li class="selectEnd">' + esc(i.option2All) + '</li></div>' +
        '<div style="display: flex;"><div class="men c">C</div><li class="selectEnd">' + esc(i.option3All) + '</li></div>' +
        '</ul></div></div>').join("");
}

function selectOnClick(i){
    setBackground(i);
    ans = i;
}

function lastOnClick(){
    counter -= 1;
    if(counter == 1)
        document.querySelector("#previous").style = "display:none";
    if(counter != 10)
        document.querySelector("#next").innerText = "下一題";

    setBackground(ansList[counter]);
    ans = ansList[counter];
    getData(counter);
}

function nextOnClick(){
    if(ans==0) return;
    ansList[counter] = ans;
    counter += 1;
    if(counter != 1)
        document.querySelector("#previous").style = "";
    if(counter == 10)
        document.querySelector("#next").innerText = "送出";
    if(counter == 11){
        convertAns();
        setAns();
        saveData();
        setChart();
        document.querySelectorAll(".end").forEach(function(el) {
            el.style.display = "";
        });
        return;
    }

    setBackground(ansList[counter]);
    ans = ansList[counter];
    getData(counter);
}

function getData(num) {
    return new Promise((resolve) => {
        const data = window.VR_QUESTIONS.find(q => q.num == String(num));
        document.querySelector(".topicType").innerText = data.Q;
        document.querySelector(".content").innerText = data.description;
        document.querySelector(".progress-text").innerText = num + " / 10";
        document.querySelector(".progress").style.width =  num*10 + "%";
        document.querySelector("#select"+place[0][num].toString()).innerText = data.option1;
        document.querySelector("#select"+place[1][num].toString()).innerText = data.option2;
        document.querySelector("#select"+place[2][num].toString()).innerText = data.option3;
        resolve();
    })
}

function setBackground(i) {
    let itemAll = document.querySelectorAll(".select");
    itemAll.forEach(function(tempItem) {
        tempItem.style.backgroundColor = 'rgb(113, 94, 55)';
    })
    let item = null;
    if(i==1){
        item = document.querySelector("#select1");
    }
    else if(i==2){
        item = document.querySelector("#select2");
    }
    else if(i==3){
        item = document.querySelector("#select3");
    }
    else{
        return;
    }
    item.style.backgroundColor = '#F56F29';
}

function saveData(){
    // 示範版不送出作答結果
}

function setAns(){
    Object.keys(finAns).forEach((key, index) => {
        finAns[key] = ansList[index] ?? finAns[key];
    });
}

function setChart() {
    var chart = document.getElementById('myPieChart');
    var ctx = chart.getContext('2d');
    chart.style = "";
    var topic = document.getElementsByClassName('topic');
    topic[0].style = "display:none";
    let a=0 ,b=0 ,c=0;
    for(let i=1;i<11;i++){
        if(ansList[i]==1) a++ ;
        else if(ansList[i]==2) b++ ;
        else c++ ;
    }
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['候選人 A', '候選人 B', '候選人 C'],
            datasets: [{
                data: [a ,b, c],
                backgroundColor: ['rgb(0, 255, 255)', 'blue', 'green'],
                borderColor: ['black', 'black', 'black'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: '你對於政策傾向的是' }
            }
        }
    });
}

function convertAns(){
    for(let a=0;a<11;a++)
        for(let b=0;b<3;b++)
            if(ansList[a] == place[b][a]){
                ansList[a] = b+1 ;
                break;
            }
}
