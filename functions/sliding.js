Let innerTexts = document.querySelectorAll('.text_wraper .innerText')
if(innerTexts){
  innerTexts.forEach(innerText=>{
    Let firstText = innerText.firstElementChild.cloneNode('true');
    innerText.appendChild(firstText);

    Let         i = 0,
         speed = 2000,
        distance = 45;
    
    setInterval(()=>{
      Let step = innerText.childElementCount;
      innerText.style.transform = 'translateY(-${distance * i}px)';
      innerText.style.transition = "0.5s ease-in-out";

      i = (i<step ? (i+1) : 1)
    }, speed)
  })
}