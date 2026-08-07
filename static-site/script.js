/* ============ CONFIG — edit after you deploy your backend ============ */
const BACKEND_URL = "https://gh-sync-14.preview.emergentagent.com"; // your FastAPI backend origin
const API = BACKEND_URL + "/api";
const SHEET_URL = "https://docs.google.com/spreadsheets/d/1lkJ0fBS50QHAXW4o8YDPLvsZRuT7-kLci6r23h5f_fA/copy";
const PDF_URL = "assets/business-bookkeeping-system.pdf"; // local copy shipped with the site
/* ==================================================================== */

/* ---------- data ---------- */
const TABS = [
  ["Setup","Set your currency, categories & profit goals in one click.","setup"],
  ["Income","Log every income source with tax, fees & net amount.","income"],
  ["Expenses","Track all spending with categories, accounts & remarks.","expenses"],
  ["Monthly","A full monthly overview with breakdowns & top sources.","monthly"],
  ["Annual","Yearly income, expenses, profit margin & goal progress.","annual"],
  ["5-Year","See five years of growth side by side, automatically.","fiveyear"],
  ["Comparison","Compare any three date ranges across your business.","comparison"],
  ["Custom","Build your own dashboard for any period you choose.","custom"],
  ["Balance","A clean balance sheet of assets over five years.","balance"],
  ["Sales Tax","Tax collected vs paid, tracked month by month.","salestax"],
];
const MARQUEE = ["PROFIT & LOSS","MONTHLY DASHBOARDS","AUTO-CALCULATIONS","TAX SUMMARY","INCOME & EXPENSES","QUARTERLY REPORTS","NO SUBSCRIPTIONS","ANNUAL OVERVIEW"];
const REVIEWS = [
  ["I finally understand where my money goes. The graphs update on their own — I just type the numbers.","Priya Nair","Bakery owner, Kochi","PN"],
  ["Set it up in 5 minutes. The monthly and annual dashboards are genuinely beautiful.","Arjun Verma","Freelance consultant","AV"],
  ["No software, no logins, works in Google Sheets on my phone. Worth way more than ₹290.","Sneha Kulkarni","Boutique, Pune","SK"],
  ["The tax tracker alone saved me hours before filing. Everything is calculated automatically.","Imran Shaikh","Café owner, Hyderabad","IS"],
  ["Compared three years of my shop's growth in seconds. My CA was impressed.","Divya Rao","Retail store, Bengaluru","DR"],
  ["Clean, fast and fully editable. I changed the categories to match my business easily.","Karan Singh","D2C brand","KS"],
];
const INCLUDES = ["Income & expense tracker","Auto profit & loss statement","Monthly sales dashboard","Quarterly & annual dashboards","Tax summary calculator","Ready-made graphs & charts","Works in Excel & Google Sheets","Fully editable · lifetime updates"];
const FAQS = [
  ["Do I need any special software?","No. It's a spreadsheet that works in Google Sheets and Microsoft Excel. If you can open a spreadsheet, you can use this."],
  ["Is it really fully editable?","Yes. Change categories, colours, labels and formulas however you like. It's your copy forever."],
  ["How do I receive the file after buying?","The instant your payment succeeds we email your access to you, and it also appears right here to open — with your Google Sheets & Excel links plus a video tutorial."],
  ["Is this a one-time payment?","Absolutely. Pay ₹290 once via Razorpay and it's yours for life. No subscriptions, no recurring charges."],
  ["Will my numbers calculate automatically?","Yes. Just enter your income and expenses — profit & loss, taxes and every dashboard update themselves with graphs."],
];

/* ---------- render lists ---------- */
const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];

// marquee (duplicated for seamless loop)
$("#marquee").innerHTML = [...MARQUEE,...MARQUEE].map(t=>`<span>${t}<b></b></span>`).join("");

// tabs
$("#tabs").innerHTML = TABS.map((t,i)=>`<button class="tab" data-i="${i}"><span class="n">${String(i+1).padStart(2,"0")}</span>${t[0]}<span class="bar"></span></button>`).join("");

// review cards
$("#revCards").innerHTML = REVIEWS.map(r=>`<div class="rev-card reveal"><div class="stars">★★★★★</div><p>“${r[0]}”</p><div class="who"><span class="ava">${r[3]}</span><div><b>${r[1]}</b><small>${r[2]}</small></div></div></div>`).join("");

// includes
$("#incl").innerHTML = INCLUDES.map(f=>`<div><span class="ck">✓</span>${f}</div>`).join("");

// faq
$("#faq").innerHTML = FAQS.map(f=>`<div class="faq-item"><button class="faq-q">${f[0]}<span class="pm">+</span></button><div class="faq-a"><p>${f[1]}</p></div></div>`).join("");

// preload dashboard images
TABS.forEach(t=>{const i=new Image();i.src=`assets/shots/${t[2]}.webp`;});

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}}),{rootMargin:"-60px"});
$$(".reveal").forEach(el=>{const d=el.dataset.delay;if(d)el.style.transitionDelay=d+"s";io.observe(el);});

/* ---------- nav scrolled ---------- */
addEventListener("scroll",()=>{ $("#nav").classList.toggle("scrolled", scrollY>40); });

/* ---------- gallery auto-play ---------- */
let active=3, paused=false, galleryTimer=null, galleryOn=false;
const showImg=$("#showImg"), capTitle=$("#capTitle"), capDesc=$("#capDesc"), frameLabel=$("#frameLabel"), autoLabel=$("#autoLabel");
function paint(){
  const t=TABS[active];
  showImg.style.opacity=0;
  showImg.src=`assets/shots/${t[2]}.webp`;
  showImg.onload=()=>{showImg.style.transition="opacity .35s";showImg.style.opacity=1;};
  capTitle.textContent=t[0]+" · "; capDesc.textContent=t[1]; frameLabel.textContent=t[0]+" tab";
  $$(".tab").forEach((b,i)=>b.classList.toggle("active",i===active));
}
function schedule(){ clearTimeout(galleryTimer); if(paused||!galleryOn)return; galleryTimer=setTimeout(()=>{active=(active+1)%TABS.length;paint();schedule();},1000); }
$$(".tab").forEach(b=>b.addEventListener("click",()=>{active=+b.dataset.i;paint();schedule();}));
const showRoot=$("#showRoot");
showRoot.addEventListener("pointerenter",e=>{if(e.pointerType==="mouse"){paused=true;autoLabel.innerHTML='Paused';schedule();}});
showRoot.addEventListener("pointerleave",e=>{if(e.pointerType==="mouse"){paused=false;autoLabel.innerHTML='<i class="pulse"></i> Auto';schedule();}});
new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){galleryOn=true;paint();schedule();}else{galleryOn=false;clearTimeout(galleryTimer);}});},{rootMargin:"200px"}).observe(showRoot);

/* ---------- hero tilt ---------- */
const tilt=$("#tilt");
tilt.parentElement.addEventListener("mousemove",e=>{
  const r=tilt.getBoundingClientRect();
  const px=(e.clientX-r.left)/r.width-0.5, py=(e.clientY-r.top)/r.height-0.5;
  tilt.style.transform=`rotateY(${px*10}deg) rotateX(${-py*8}deg)`;
});
tilt.parentElement.addEventListener("mouseleave",()=>tilt.style.transform="");

/* ---------- faq accordion ---------- */
$$(".faq-q").forEach(q=>q.addEventListener("click",()=>{
  const item=q.parentElement, a=q.nextElementSibling, open=item.classList.contains("open");
  $$(".faq-item").forEach(i=>{i.classList.remove("open");i.querySelector(".faq-a").style.maxHeight=null;});
  if(!open){item.classList.add("open");a.style.maxHeight=a.scrollHeight+"px";}
}));

/* ---------- sticky bar + countdown ---------- */
const sticky=$("#sticky"), cd=$("#cd"), WINDOW=15*60*1000;
addEventListener("scroll",()=>{
  const nearBottom = scrollY+innerHeight > document.body.scrollHeight-240;
  sticky.classList.toggle("show", scrollY>760 && !nearBottom);
});
let dl=+localStorage.getItem("lk_deadline"); if(!dl||dl<Date.now())dl=Date.now()+WINDOW;localStorage.setItem("lk_deadline",dl);
setInterval(()=>{
  let rem=dl-Date.now(); if(rem<=0){dl=Date.now()+WINDOW;localStorage.setItem("lk_deadline",dl);rem=WINDOW;}
  const m=String(Math.floor(rem/60000)).padStart(2,"0"), s=String(Math.floor(rem%60000/1000)).padStart(2,"0");
  cd.textContent=`${m}:${s}`;
},1000);

/* ---------- modal + Razorpay ---------- */
const modal=$("#modal");
const stages={form:$("#stageForm"),processing:$("#stageProcessing"),done:$("#stageDone"),error:$("#stageError")};
function setStage(n){for(const k in stages)stages[k].style.display=(k===n)?"":"none";}
function openModal(){modal.classList.add("open");setStage("form");}
function closeModal(){modal.classList.remove("open");}
$$(".js-buy").forEach(b=>b.addEventListener("click",openModal));
$$(".js-close").forEach(b=>b.addEventListener("click",closeModal));

function loadRazorpay(){return new Promise(res=>{if(window.Razorpay)return res(true);const s=document.createElement("script");s.src="https://checkout.razorpay.com/v1/checkout.js";s.onload=()=>res(true);s.onerror=()=>res(false);document.body.appendChild(s);});}
function fail(msg){$("#errMsg").textContent=msg;setStage("error");}

$("#payBtn").addEventListener("click",async()=>{
  const email=$("#email").value.trim();
  const ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  $("#emailErr").style.display=ok?"none":"block";
  if(!ok)return;
  setStage("processing");
  try{
    if(!(await loadRazorpay()))return fail("Could not load the payment window. Check your connection and try again.");
    const res=await fetch(`${API}/payments/create-order`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})});
    if(!res.ok)return fail("Could not start the payment. Please try again.");
    const order=await res.json();
    const rzp=new window.Razorpay({
      key:order.key_id,amount:order.amount,currency:order.currency,order_id:order.order_id,
      name:"LedgerKit",description:"Business Bookkeeping Sheet System — lifetime access",
      prefill:{email},theme:{color:"#0f0f0f"},
      modal:{ondismiss:()=>setStage("form")},
      handler:async(r)=>{
        try{
          const v=await fetch(`${API}/payments/verify`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({razorpay_order_id:r.razorpay_order_id,razorpay_payment_id:r.razorpay_payment_id,razorpay_signature:r.razorpay_signature})});
          if(!v.ok)return fail("We couldn't verify your payment. If money was deducted, contact support with your payment ID.");
          $("#doneEmail").textContent=email;
          $("#sheetBtn").href=SHEET_URL; $("#pdfBtn").href=PDF_URL;
          setStage("done");
        }catch{fail("Verification error. If money was deducted, please contact support.");}
      },
    });
    rzp.on("payment.failed",()=>fail("Payment failed or was cancelled. You have not been charged."));
    rzp.open();
  }catch{fail("Something went wrong starting the payment. Please try again.");}
});
$("#retryBtn").addEventListener("click",()=>setStage("form"));
