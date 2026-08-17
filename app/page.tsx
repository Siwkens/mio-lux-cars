"use client";

import { useRef, useState } from "react";

const cars = [
  { id: 1, name: "Chevrolet Camaro 2SS", category: "Sportowe", power: 455, price: 999, image: "/cars/car-0.png", drive: "RWD" },
  { id: 2, name: "Ford Mustang GT", category: "Sportowe", power: 450, price: 899, image: "/cars/car-1.png", drive: "RWD" },
  { id: 3, name: "Mercedes E 220 d 4MATIC", category: "Luksusowe", power: 194, price: 799, image: "/cars/car-2.png", drive: "AWD" },
  { id: 4, name: "Mercedes CLA 250 4MATIC", category: "Luksusowe", power: 224, price: 699, image: "/cars/car-3.png", drive: "AWD" },
];
type Car = (typeof cars)[number];
const money = (value: number) => new Intl.NumberFormat("pl-PL").format(value);
const addDays = (days: number) => { const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString().slice(0,10); };
const heroChapters = [
  { name:"MUSTANG GT", meta:"PERFORMANCE / 450 HP", time:0 },
  { name:"SUPERCAR", meta:"EXOTIC / NIGHT EDITION", time:3.2 },
  { name:"MAYBACH", meta:"EXECUTIVE / FIRST CLASS", time:5.2 },
  { name:"BMW M", meta:"SPORT LUXURY / M POWER", time:7.2 },
];

function Brand() { return <a className="brand" href="#top"><b>MIO</b><span>LUX CARS</span></a>; }
function Action({children,outline=false,onClick}:{children:React.ReactNode;outline?:boolean;onClick?:()=>void}) { return <button className={`action ${outline?"outline":""}`} onClick={onClick}>{children}<i>→</i></button>; }

export default function Home() {
  const [filter,setFilter]=useState("Wszystkie");
  const [selected,setSelected]=useState<Car|null>(null);
  const [menu,setMenu]=useState(false);
  const [faq,setFaq]=useState(0);
  const [heroProgress,setHeroProgress]=useState(0);
  const heroVideo=useRef<HTMLVideoElement|null>(null);
  const dragStart=useRef<{x:number;time:number}|null>(null);
  const heroChapter=heroProgress<32?0:heroProgress<52?1:heroProgress<72?2:3;
  const seekHero=(time:number)=>{if(!heroVideo.current)return;heroVideo.current.currentTime=time;setHeroProgress((time/(heroVideo.current.duration||10))*100);heroVideo.current.play().catch(()=>{})};
  const shown=filter==="Wszystkie"?cars:cars.filter(c=>c.category===filter);
  const moveHero = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - .5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - .5) * 2;
    event.currentTarget.style.setProperty("--mx", x.toFixed(3));
    event.currentTarget.style.setProperty("--my", y.toFixed(3));
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    if(dragStart.current&&heroVideo.current?.duration){
      const duration=heroVideo.current.duration;
      const delta=((event.clientX-dragStart.current.x)/rect.width)*duration*1.25;
      const next=(dragStart.current.time+delta+duration*10)%duration;
      heroVideo.current.currentTime=next;
      setHeroProgress((next/duration)*100);
    }
  };
  const resetHero = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--mx", "0");
    event.currentTarget.style.setProperty("--my", "0");
  };
  return <>
    <header className="header"><div className="container headerInner"><Brand/><nav className={menu?"nav open":"nav"}>{[["Flota","flota"],["Doświadczenia","experience"],["Jak to działa","how"],["Opinie","reviews"],["FAQ","faq"],["Kontakt","contact"]].map(([label,id])=><a key={id} href={`#${id}`} onClick={()=>setMenu(false)}>{label}</a>)}</nav><button className="reserveTop" onClick={()=>setSelected(cars[0])}>▣ Zarezerwuj teraz</button><button className="menu" onClick={()=>setMenu(!menu)} aria-label="Menu">{menu?"×":"☰"}</button></div></header>
    <main>
      <section className="hero hero360" id="top" onPointerMove={moveHero} onPointerLeave={event=>{resetHero(event);dragStart.current=null;heroVideo.current?.play().catch(()=>{})}} onPointerDown={event=>{if(!heroVideo.current)return;dragStart.current={x:event.clientX,time:heroVideo.current.currentTime};heroVideo.current.pause();event.currentTarget.setPointerCapture(event.pointerId)}} onPointerUp={event=>{dragStart.current=null;heroVideo.current?.play().catch(()=>{});event.currentTarget.releasePointerCapture(event.pointerId)}}>
        <div className="heroStage" aria-hidden="true"><video ref={heroVideo} className="turntableVideo" autoPlay muted loop playsInline preload="metadata" poster="/hero-media/fleet-stage-poster.jpg" onTimeUpdate={event=>{const video=event.currentTarget;if(video.duration)setHeroProgress((video.currentTime/video.duration)*100)}}><source src="/hero-media/fleet-stage.webm" type="video/webm"/><source src="/hero-media/fleet-stage.mp4" type="video/mp4"/></video><div className="heroVignette"/><div className="heroScan"/><div className="heroSweep"/><div className="heroCursorLight"/></div>
        <div className="heroHud" aria-hidden="true"><span>{heroChapters[heroChapter].meta}</span><b>{String(heroChapter+1).padStart(2,"0")}/04</b></div>
        <div className="container heroContent"><h1>TWOJE MIASTO.<br/>TWÓJ MOMENT.<br/><em>TWOJA MASZYNA.</em></h1><p>Samochody sportowe i luksusowe dostępne w Warszawie.<br/>Na dzień, weekend albo okazję, której nie zapomnisz.</p><div className="actions"><Action onClick={()=>setSelected(cars[1])}>Sprawdź dostępność</Action><Action outline onClick={()=>document.querySelector("#flota")?.scrollIntoView({behavior:"smooth"})}>Odkryj flotę</Action></div></div>
        <div className="fleetStage" aria-label="Wybierz segment interaktywnej prezentacji floty">{heroChapters.map((chapter,index)=><button key={chapter.name} className={heroChapter===index?"active":""} onPointerDown={event=>event.stopPropagation()} onClick={()=>seekHero(chapter.time)}><small>0{index+1}</small><span>{chapter.name}</span></button>)}</div>
        <div className="turntableControl" aria-label="Interaktywna prezentacja floty"><span>PRZECIĄGNIJ / WYBIERZ MODEL</span><b>LIVE</b><i><em style={{width:`${heroProgress}%`}}/></i></div>
      </section>
      <section className="section" id="flota"><div className="container"><div className="sectionHead"><div><p className="label">NASZA FLOTA</p><h2>WYBIERZ SWOJĄ MASZYNĘ</h2></div><div className="filters">{["Wszystkie","Sportowe","Luksusowe"].map(x=><button key={x} className={filter===x?"active":""} onClick={()=>setFilter(x)}>{x}</button>)}</div></div><div className="fleetGrid">{shown.map(car=><article className="carCard" key={car.id}><div className="carMedia"><img src={car.image} alt={car.name}/><span>{car.category}</span></div><div className="carBody"><h3>{car.name}</h3><p><i>◉</i>{car.power} KM <b/> AUTOMAT <b/> {car.drive}</p><div className="carPrice"><small>od</small><strong>{money(car.price)} zł</strong><small>/ dzień</small><button onClick={()=>setSelected(car)} aria-label={`Rezerwuj ${car.name}`}>↗</button></div></div></article>)}</div></div></section>
      <section className="experience" id="experience"><div className="experiencePhoto"><img src="/cars/car-1.png" alt="Samochód sportowy"/></div><div className="experienceCopy"><p className="label">NIE TYLKO SAMOCHÓD</p><h2>DOŚWIADCZENIE,<br/>KTÓRE ZOSTAJE.</h2><p>Każdy detal ma znaczenie. Perfekcyjnie przygotowane auto, elastyczny odbiór i opieka od pierwszego kontaktu aż po zwrot kluczyków.</p><div className="facts"><div><b>24/7</b><span>Wsparcie podczas wynajmu</span></div><div><b>100%</b><span>Przejrzyste warunki</span></div></div></div></section>
      <section className="section" id="how"><div className="container"><p className="label">JAK TO DZIAŁA</p><h2>WYNAJEM W 3 PROSTYCH KROKACH</h2><div className="steps">{[["01","WYBIERZ TERMIN I AUTO","Sprawdź dostępność i wybierz idealne auto."],["02","ODBIÓR LUB DOSTAWA","Odbierz auto w Warszawie lub zamów dostawę."],["03","JEDŹ I CIESZ SIĘ","Poczuj moc, komfort i swobodę."]].map(([n,t,c])=><article key={n}><strong>{n}</strong><div><h3>{t}</h3><p>{c}</p></div></article>)}</div></div></section>
      <section className="reviews" id="reviews"><div className="container reviewsGrid"><div><p className="label">OPINIE KLIENTÓW</p><h2>ZAUFANIE BUDUJE<br/>KAŻDA PODRÓŻ.</h2><div className="rating"><b>5.0</b><span>★★★★★<small>120+ zweryfikowanych opinii</small></span></div></div><blockquote>„Niezapomniane doświadczenie. Auto w idealnym stanie, szybki odbiór i obsługa na najwyższym poziomie. Na pewno wrócę.”<footer>— Kamil M., Warszawa</footer></blockquote></div></section>
      <section className="section" id="faq"><div className="container faqGrid"><div><p className="label">FAQ</p><h2>NAJCZĘŚCIEJ<br/>ZADAWANE PYTANIA</h2><p>Nie znalazłeś odpowiedzi? Napisz do nas — odpowiadamy zwykle w kilka minut.</p></div><div>{["Jakie dokumenty są potrzebne do wynajmu?","Czy jest limit kilometrów?","Czy mogę zamówić dostawę pod adres?","Co w przypadku uszkodzenia auta?"].map((q,i)=><article className={faq===i?"active":""} key={q}><button onClick={()=>setFaq(faq===i?-1:i)}><span>{q}</span><b>⌄</b></button><p>{i===0?"Prawo jazdy, dokument tożsamości i karta płatnicza. Minimalny wiek kierowcy to 25 lat.":i===1?"Pakiet obejmuje 200 km na dobę. Dodatkowe kilometry rozliczamy zgodnie z klasą auta.":i===2?"Tak. Dostarczymy auto pod wskazany adres w Warszawie i okolicach.":"Każde auto posiada pełne ubezpieczenie. Nasz zespół przeprowadzi Cię przez cały proces."}</p></article>)}</div></div></section>
      <section className="final" id="contact"><div className="container"><div><p className="label">GOTOWY NA SWOJĄ MASZYNĘ?</p><h2>ZAREZERWUJ TERAZ<br/>I POCZUJ RÓŻNICĘ.</h2></div><Action onClick={()=>setSelected(cars[0])}>Zarezerwuj teraz</Action></div></section>
    </main>
    <footer className="footer"><div className="container"><div className="footerTop"><Brand/><nav><a href="#flota">Flota</a><a href="#how">Jak to działa</a><a href="#reviews">Opinie</a><a href="#faq">FAQ</a></nav><a href="mailto:hello@mioluxcars.pl">hello@mioluxcars.pl</a></div><div className="footerBottom"><span>© 2026 MIO LUX CARS. Wszystkie prawa zastrzeżone.</span><span>Warszawa • +48 500 400 300</span></div></div></footer>
    {selected&&<Booking car={selected} onClose={()=>setSelected(null)}/>} 
  </>;
}

function Booking({car,onClose}:{car:Car;onClose:()=>void}) {
  const [start,setStart]=useState(addDays(1)); const [end,setEnd]=useState(addDays(3)); const [delivery,setDelivery]=useState(false); const [done,setDone]=useState(false);
  const days=Math.max(1,Math.ceil((new Date(end).getTime()-new Date(start).getTime())/86400000)); const total=days*car.price+(delivery?200:0);
  return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><aside className={`booking ${done?"done":""}`} role="dialog" aria-modal="true"><div className="bookingTop"><p>REZERWACJA</p><button onClick={onClose} aria-label="Zamknij">×</button></div>{done?<div className="success"><span>✓</span><p className="label">REZERWACJA PRZYJĘTA</p><h2>Twoja maszyna czeka.</h2><p>Potwierdzenie i szczegóły odbioru wyślemy SMS-em. Numer: <b>MLC-{String(Date.now()).slice(-5)}</b></p><Action onClick={onClose}>Wróć do strony</Action></div>:<><img src={car.image} alt=""/><h2>{car.name}</h2><p className="power">◉ {car.power} KM</p><div className="formGrid"><label>DATA ODBIORU<input type="date" min={addDays(0)} value={start} onChange={e=>setStart(e.target.value)}/></label><label>DATA ZWROTU<input type="date" min={start} value={end} onChange={e=>setEnd(e.target.value)}/></label></div><label>MIEJSCE ODBIORU<select><option>MIO LUX CARS — Warszawa</option><option>Lotnisko Chopina</option><option>Warszawa Centralna</option></select></label><label className="check"><input type="checkbox" checked={delivery} onChange={e=>setDelivery(e.target.checked)}/><span/>Dostawa pod adres <b>+ 200 zł</b></label><div className="summary"><div><span>Wynajem ({days} dni)</span><b>{money(days*car.price)} zł</b></div>{delivery&&<div><span>Dostawa</span><b>200 zł</b></div>}<div><span>Limit kilometrów</span><b>{days*200} km</b></div><hr/><small>SZACOWANA KWOTA</small><strong>{money(total)} zł</strong><em>z VAT</em></div><p className="safe">♢ Brak ukrytych opłat.</p><Action onClick={()=>setDone(true)}>Potwierdź rezerwację</Action><small className="bookingNote">Rezerwacja zajmie 1–2 minuty.</small></>}</aside></div>;
}
