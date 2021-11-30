const EDO = require("edo.js").EDO;

const hz_to_midi = function (hz) {
    let result = (12*Math.log2(hz/440))+69
    let int = Math.floor(result)
    let dec = result-int
    let cents = Math.round(dec*100)
    if(cents>50) {
        int = int+1
        cents = (100-cents)*-1
    }
    return {result: result, midi:int, cents:cents}
}

//Adds some constant frequency to a given chord
const chord_adder = function (chord,constant) {
    const edo = new EDO()

    let chord_as_hz = edo.convert.midi_to_freq(chord,0)
    let final = chord_as_hz.map(el=>el+constant)
    let as_midi = final.map(el=>{
        let result = hz_to_midi(el)
        let name = edo.convert.midi_to_name(result.midi)
        result.name = name
        return result
    })
    return as_midi
}


const chord_difference = function (chord1,chord2) {
    const edo = new EDO()

    if(chord1.length!=chord2.length) return console.log("Chords must have the same number of pitches")
    let chord1_hz = edo.convert.midi_to_freq(chord1)
    let chord2_hz = edo.convert.midi_to_freq(chord2)
    let new_chord = []
    for (let n = 0; n < chord1_hz.length; n++) {
        new_chord.push(chord1_hz[n]-chord2_hz[n])
    }
    new_chord = new_chord.map(simon=>{
        simon=Math.abs(simon)
        let result = hz_to_midi(simon)
        let name = edo.convert.midi_to_name(result.midi)
        result.name = name
        return result
    })
    return new_chord
}





let progression = [[52,55,59],[56,60,63],[55,58,62,65],[57,61,64]] //progression to manipulate
let progression_shift = -3 //Number of semitones to shift in each iteration

let current_shift = 0
for (let i = 0; i < 5; i++) { //Runs 5 times
    for (let chord of progression) {
        let shifted = chord.map(note=>note+current_shift)
        console.log(chord_adder(shifted,-50)) //Spits out the result
    }
    current_shift+=progression_shift //Shift entire progression
}

console.log(chord_difference([60,72],[58,59])) //Subtracts two chords' frequencies



