
import RecordRTC from '../../node_modules/recordrtc/RecordRTC';

var isEdge = navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);
var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

var recorder; // globally accessible
var microphone;

const captureStream = (callback) => {
	if(microphone){
		callback(microphone);
		return;
	}

	if(typeof navigator.mediaDevices === 'undefined' || !navigator.mediaDevices.getUserMedia) {
		alert('This browser does not supports WebRTC getUserMedia API.');

		if(!!navigator.getUserMedia) {
			alert('This browser seems supporting deprecated getUserMedia API.');
		}
	}

	navigator.mediaDevices.getUserMedia({
		audio: true
	})
	.then( async function(stream) {
		callback(stream);
	})
	.catch(function(error) {
		alert('Unable to capture your microphone. Please check console logs.');
		console.error(error);
	});
}

const automaticRecord = () => {
	if(!microphone){
		captureStream( callBackFunction );
	}
}

const callBackFunction = (stream) => {
	microphone = stream;

	if(microphone){

		let options = {
			type: 'audio',
			numberOfAudioChannels: isEdge ? 1 : 2,
			checkForInactiveTracks: true,
			bufferSize: 16384
		};

		if(isSafari || isEdge) {
			options.recorderType = RecordRTC.StereoAudioRecorder;
		}

		if(navigator.platform && navigator.platform.toString().toLowerCase().indexOf('win') === -1) {
			options.sampleRate = 48000; // or 44100 or remove this line for default
		}

		if(isSafari) {
			options.sampleRate = 44100;
			options.bufferSize = 4096;
			options.numberOfAudioChannels = 2;
		}

		if(recorder) {
			recorder.destroy();
			recorder = null;
		}

		recorder = RecordRTC(stream, options);
		recorder.startRecording();
		console.log(recorder);

		// setTimeout(()=>{
		// 	recorder.stopRecording(function() {
		// 		let blob = recorder.getBlob();
		// 		recorder.save('audio.mp3');
		// 		RecordRTC.invokeSaveAsDialog(blob);
		// 	});
		// },5000);

		if(isSafari) {
			alert('Please refresh maybe. First time we tried to access your microphone. Now we will record it.');
			return;
		}
	}
}

export default automaticRecord;