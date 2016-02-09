/*
 * 1K JavaScript Speech Synthesizer
 *
 * This is a simple formant based speech synthesizer in less than 1K of JavaScript.
 * Synthesizes speech as you type, and whole sentences upon pressing ENTER.
 * Allow the user to set the volume/stop/pause/replay/save the synthesized speech.
 *
 * The folllowing sounds/phonemes are supported:
 *
 * a,b,d,e,E,f,g,h,i,j,k,l,m,n,o,p,r,s,S,T,t,u,v,w,z,Z
 *
 * Hope you like this entry for JS1K#4
 *
 * Based on Tiny Speech Synth by Stepanov Andrey - http://www.pouet.net/prod.php?which=50530
 * Optimized and minified manually, by yours truly, @p01 - http://www.p01.org/releases/
 * Compressed down to 909 bytes using my experimental packer ( sorry it's not ready for release )
 *
 * To go under 1K, I had to sacrifice quality a bit and limit the synthesizer to two formant filters using either a sawtooth or noise and discard plosive sounds.
 *
 * Mathieu 'p01' Henri - @p01 - http://www.p01.org/releases/
 *
 */

// formant filters and amplifier info of each sound/phoneme
// NOTE the string is base64 encoded here to make the code  easier to read
H=atob('NDcLCwYtYAsLAy1gCwsDLTYLCwM6RgsLDzZaCwsPPFALCwwrNgsLASo8FAsDKjwoAQUtRAsFAyxGMgEFLCwLCwIsYwsLAiw8CwsCLGMLCwIrMh4IAzA8CwsFKjIPBQEwPAsLBD5CHgsLeJZQKAUURmNjCywyBQsCLDwLFAM8YwsLBg==');

// title, fullsize input and Audio element
b.innerHTML='<audio id=a autoplay></audio>';

// keypress handler
(onkeypress=function(e)
{
  // the string to speak ( either the whole text or the current keypress )
  M=!e||e.which==13?document.getElementById('d').value:String.fromCharCode(e.which);
  // loop through the string and generate the sound of each character
  for(S='',h=g=l=k=s=0;s// sliding window of the formant filter + check if we have formant info to process the current character
    if(t=128,f=g,g=h,j=k,k=l,~(p='oijuaeEwvTzZbdmnrlgfhsSptk'.indexOf(M[0|s])))
      // 2 formant filters
      b=g,c=f,d=1-H.charCodeAt(p*5+2|a)/255,l=d*(b*2*Math.sin(H.charCodeAt(p*5+0|a)/25)-d*c)+(p>20?Math.random():s*16%1)-.5,a^=1,h=l,
      b=k,c=j,d=1-H.charCodeAt(p*5+2|a)/255,l=d*(b*2*Math.sin(H.charCodeAt(p*5+0|a)/25)-d*c)+(p>20?Math.random():s*16%1)-.5,a^=1,
      // combine the formant filters
      t+=Math.min(1,4*Math.sin(Math.PI*s))*((h+l)*H.charCodeAt(p*5+4)+(g+k)/2+(f+j)/8);

  // generate a WAVE PCM file and update the Audio element
  t='data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgA',document.getElementById('a').src=t+btoa(t+S)
})
// synthesize the default sentence right away
()