// making it less complicated than the old code

async function fetchLeaderboard(){
    try{
        const r=await fetch('https://bot.shapes.lol/clb');
        const d=await r.json();
        const tbody=document.querySelector('#leaderboard tbody');
        tbody.innerHTML='';
        for(const [,s] of d.Leaderboard){
            const tr=document.createElement('tr');
            const t1=document.createElement('td'); t1.dataset.label='server name'; t1.textContent=s.serverName;
            const t2=document.createElement('td'); t2.dataset.label='current number'; const sp2=document.createElement('span'); sp2.textContent=s.currentnumber; t2.appendChild(sp2);
            const t3=document.createElement('td'); t3.dataset.label='highest number'; const sp3=document.createElement('span'); sp3.textContent=s.highestnumber; t3.appendChild(sp3);
            tr.append(t1,t2,t3);
            tbody.appendChild(tr);
        }
    }catch(e){}
}
fetchLeaderboard();setInterval(fetchLeaderboard,10000);
