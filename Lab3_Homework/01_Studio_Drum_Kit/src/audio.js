// Contract: lazy AudioContext; bounded FIFO voices; disconnect on ended, close on dispose.
export class Synth {
 constructor(limit=8){this.limit=limit;this.voices=new Map();this.nodes=new Set();this.ctx=null;}
 async ready(){this.ctx??=new AudioContext();if(this.ctx.state==='suspended')await this.ctx.resume();}
 on(id,freq,type='sine'){if(!this.ctx||this.voices.has(id))return null;let stolen=null;if(this.voices.size>=this.limit){stolen=this.voices.keys().next().value;this.off(stolen);}const osc=this.ctx.createOscillator(),gain=this.ctx.createGain(),now=this.ctx.currentTime;osc.type=type;osc.frequency.setValueAtTime(freq,now);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.09,now+.012);osc.connect(gain);gain.connect(this.ctx.destination);const voice={osc,gain};this.nodes.add(voice);osc.onended=()=>{osc.disconnect();gain.disconnect();this.nodes.delete(voice)};osc.start();this.voices.set(id,voice);return stolen;}
 off(id){const v=this.voices.get(id);if(!v)return;this.voices.delete(id);const t=this.ctx.currentTime;v.gain.gain.cancelScheduledValues(t);v.gain.gain.setValueAtTime(Math.max(.0001,v.gain.gain.value),t);v.gain.gain.exponentialRampToValueAtTime(.0001,t+.04);v.osc.stop(t+.05);}
 stop(){for(const id of [...this.voices.keys()])this.off(id);}
 dispose(){this.stop();const ctx=this.ctx;this.ctx=null;if(ctx)void ctx.close();for(const v of this.nodes){v.osc.disconnect();v.gain.disconnect()}this.nodes.clear();}
}
