const data = {
  metrics: [['Patients today','84','+12% vs yesterday'],['Pending referrals','8','2 fewer this week'],['Follow-ups due','17','5 high-priority'],['Referral completion','82%','+4% this month']],
  alerts: [['Emergency referral needed','Ravi Kumar requires cardiology evaluation.','!'],['Missed follow-up alert','3 high-risk patients missed a scheduled follow-up.','!'],['Medicine stock shortage','Insulin stock is below the threshold at PHC A.','!']],
  patients: [['Ravi Kumar','Hypertension · Critical','Follow-up'],['Fatima Begum','High-risk pregnancy · Medium','Triage'],['Venkat Rao','Diabetes complications · High','Referral']],
  referrals: [
    {id:'REF-10234',patient:'Ravi Kumar',specialty:'Cardiology',priority:'Priority',status:'closed',next:'Follow-up scheduled'},
    {id:'REF-10235',patient:'Venkat Rao',specialty:'Endocrinology',priority:'Routine',status:'appointment',next:'Tomorrow, 10:00 AM'},
    {id:'REF-10236',patient:'Fatima Begum',specialty:'Obstetrics',priority:'Priority',status:'created',next:'Awaiting acceptance'},
    {id:'REF-10237',patient:'Meena Devi',specialty:'Pulmonology',priority:'Priority',status:'missed',next:'Outreach required'}],
  facilities:[
    {name:'PHC A — Rampur',type:'Primary Health Centre',distance:'2 km away',status:'Operational',doctors:'General medicine available',diagnostics:'CBC · Blood glucose · BP monitor',queue:'4 patients'},
    {name:'Rural Hospital B — Devapur',type:'Rural Hospital',distance:'18 km away',status:'Operational',doctors:'Medicine · Surgery',diagnostics:'ECG · X-ray · CBC',queue:'8 patients'},
    {name:'District Hospital — Central City',type:'District Hospital',distance:'35 km away',status:'Operational',doctors:'Cardiology · Neurology · Orthopedics',diagnostics:'ECG · CT · Ultrasound · X-ray',queue:'12 patients'}],
  followups:[['Ravi Kumar','Hypertension post-treatment','Due today','ASHA-17','Urgent','due'],['Fatima Begum','Pregnancy monitoring','Tomorrow','ANM-03','Priority','scheduled'],['Venkat Rao','Diabetes control check','In 5 days','ASHA-12','Priority','scheduled'],['Ashoka Reddy','Fever follow-up','Tomorrow','ANM-01','Routine','scheduled']]
};
const stages=['Registered','Triaged','Consulted','Referred','Appointment','Arrived','Treated','Follow-up','Closed'];
const $=s=>document.querySelector(s); const $$=s=>document.querySelectorAll(s);
function badge(value){let c=value==='closed'||value==='scheduled'||value==='Routine'?'green':value==='missed'||value==='due'||value==='Urgent'?'red':value==='Priority'?'amber':'blue';return `<span class="badge ${c}">${value.replace('-', ' ')}</span>`}
function render(){
 $('#metrics').innerHTML=data.metrics.map(([label,value,trend])=>`<article class="metric"><small>${label}</small><strong>${value}</strong><span class="trend">${trend}</span></article>`).join('');
 $('#pipeline').innerHTML=stages.map((x,i)=>`<div class="stage"><i>${i+1}</i><span>${x}</span></div>`).join('');
 $('#alerts').innerHTML=data.alerts.map(([title,description,icon])=>`<div class="alert"><span class="alert-icon">${icon}</span><div class="row-copy"><strong>${title}</strong><small>${description}</small></div></div>`).join('');
 $('#patients').innerHTML=data.patients.map(([n,d,s])=>`<div class="patient-row"><span class="alert-icon">♙</span><div class="row-copy"><strong>${n}</strong><small>${d}</small></div>${badge(s)}</div>`).join('');
 $('#facilityCards').innerHTML=data.facilities.map(f=>`<article class="facility-card"><span class="badge green">${f.status}</span><h2>${f.name}</h2><p>${f.type} · ${f.distance}</p><div class="facility-list"><div><span>Doctors</span><strong>${f.doctors}</strong></div><div><span>Diagnostics</span><strong>${f.diagnostics}</strong></div><div><span>Queue</span><strong>${f.queue}</strong></div></div></article>`).join('');
 $('#followupRows').innerHTML=data.followups.map(r=>`<tr>${r.map((x,i)=>`<td>${i===4||i===5?badge(x):x}</td>`).join('')}</tr>`).join('');
 renderReferrals();
}
function renderReferrals(){const q=$('#referralSearch').value.toLowerCase(),filter=$('#statusFilter').value; const rows=data.referrals.filter(r=>(filter==='all'||r.status===filter)&&(`${r.id} ${r.patient}`).toLowerCase().includes(q));$('#referralRows').innerHTML=rows.length?rows.map(r=>`<tr><td><strong>${r.id}</strong></td><td>${r.patient}</td><td>${r.specialty}</td><td>${badge(r.priority)}</td><td>${badge(r.status)}</td><td>${r.next}</td></tr>`).join(''):`<tr><td colspan="6">No referrals match this filter.</td></tr>`}
function showView(id){$$('.view').forEach(v=>v.classList.toggle('active',v.id===id));$$('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.view===id));$('#sidebar').classList.remove('open');window.scrollTo(0,0)}
function toast(message){let e=$('#toast');e.textContent=message;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2600)}
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));$$('[data-go]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.go)));$('#menuButton').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));$('#referralSearch').addEventListener('input',renderReferrals);$('#statusFilter').addEventListener('change',renderReferrals);
$('#offlineButton').addEventListener('click',()=>{const e=$('#networkStatus'),offline=e.textContent.includes('Offline');e.textContent=offline?'● Online · synced':'● Offline · 3 records pending';e.style.color=offline?'#168260':'#b54708';toast(offline?'Connection restored. Pending records synced.':'Offline mode enabled. Records will sync later.')});
$('#languageSelect').addEventListener('change',e=>toast(e.target.value==='en'?'English selected':'Language option selected for the prototype.'));
$('#triageForm').addEventListener('submit',e=>{e.preventDefault();const bp=+$('#bp').value,sp=+$('#spo2').value,red=$('#chestPain').checked&&$('#breathing').checked||$('#bleeding').checked||$('#unconscious').checked||sp<90||bp>=180;const amber=!red&&(sp<=93||bp>=160||$('#chestPain').checked||$('#breathing').checked);const type=red?'red':amber?'amber':'green',label=red?'Emergency critical (Red)':amber?'Urgent priority (Yellow)':'Routine (Green)',action=red?'Immediate clinical evaluation and emergency referral to District Hospital required.':amber?'Urgent evaluation required. Notify the PHC medical officer and arrange teleconsultation.':'Patient may continue to the routine outpatient queue with follow-up.';$('#triageResult').innerHTML=`<section class="card result ${type}"><p class="eyebrow green">TRIAGE ASSESSMENT COMPLETE</p><h2>${label}</h2><p><strong>${$('#patientName').value}</strong> · BP ${bp} · SpO₂ ${sp}% · Pulse ${$('#pulse').value} bpm</p><p>${action}</p><button class="primary" type="button" id="createReferral">Create referral →</button></section>`;$('#createReferral').addEventListener('click',()=>{showView('referrals');toast('Demo referral created for '+$('#patientName').value+'.')});});
render();
