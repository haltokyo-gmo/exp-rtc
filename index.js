$(function() {
	function MaxEmotion(scores) {
		var max = Math.max(
			scores.anger,
			scores.contempt,
			scores.disgust,
			scores.fear,
			scores.happiness,
			scores.neutral,
			scores.sadness,
			scores.surprise
		);

		switch(max) {
		case scores.anger:
			return 'anger ' + scores.anger.toFixed(4);
		case scores.contempt:
			return 'contempt ' + scores.contempt.toFixed(4);
		case scores.disgust:
			return 'disgust ' + scores.disgust.toFixed(4);
		case scores.fear:
			return 'fear ' + scores.fear.toFixed(4);
		case scores.happiness:
			return 'happiness ' + scores.happiness.toFixed(4);
		case scores.neutral:
			return 'neutral ' + scores.neutral.toFixed(4);
		case scores.sadness:
			return 'sadness ' + scores.sadness.toFixed(4);
		case scores.surprise:
			return 'surprise ' + scores.surprise.toFixed(4);
		default:
			return 'none';
		}
	}

	var stream;
	navigator.mediaDevices.getUserMedia({video: {
		mandatory: {
			maxWidth: 600,
			maxHeight: 400
		}
	}, audio: false})
	.then(function(s) {
		stream = s;

		var v = document.querySelector('#video');
		v.src = URL.createObjectURL(stream);
		v.play();
	})
	.catch(function(error) {
		console.error(error);
	})

	var canvas = document.querySelector('#canvas');
	var ctx = canvas.getContext('2d');
	ctx.scale(-1, 1);

	document.querySelector('#capture').addEventListener('click', function() {
		ctx.drawImage(document.querySelector('#video'), -600, 0);
		var base64 = canvas.toDataURL('image/jpeg');
		var bin = atob(base64.replace(/^.*,/, ''));
		var buffer = new Uint8Array(bin.length);
		for (var i = 0; i < bin.length; i++) {
			buffer[i] = bin.charCodeAt(i);
    }

		$.ajax({
			cache: false,
			contentType: 'application/octet-stream',
			data: buffer.buffer,
			dataType: 'json',
			headers: {
				'Ocp-Apim-Subscription-Key': 'subscription_key_here'
			},
			method: 'POST',
			processData: false,
			url: 'https://api.projectoxford.ai/emotion/v1.0/recognize'
		})
		.done(function(data) {
			var canvas_overlay = document.querySelector('#canvas-overlay');
			var ctx_overlay = canvas_overlay.getContext('2d');
			ctx_overlay.clearRect(0, 0, canvas_overlay.width, canvas_overlay.height);

			for(var i in data) {
				var rect = data[i].faceRectangle;
				var text = MaxEmotion(data[i].scores);

				ctx_overlay.beginPath();
				ctx_overlay.strokeRect(rect.left, rect.top, rect.width, rect.height);
				ctx_overlay.fillStyle = 'black';
				var m = ctx_overlay.measureText(text);
				ctx_overlay.fillRect(rect.left, rect.top - 10, m.width, 10);
				ctx_overlay.fillStyle = 'white';
				ctx_overlay.fillText(text, rect.left, rect.top);
				ctx_overlay.closePath();
			}
		})
		.fail(function(error) {
			console.log(error);
		})
	})

	document.querySelector('#record').addEventListener('click', function() {
		var recorder = new MediaRecorder(stream, {
      videoBitsPerSecond: 1024 * 1024, // 1Mbps
      mimeType: 'video/webm'
    });

		var chunks = [];

		recorder.onstop = function(e) {
      var blob = new Blob(chunks, { 'type' : 'video/webm' });
      chunks = [];
      var url = window.URL.createObjectURL(blob);
      document.querySelector('#result').src = url;
    }

    recorder.ondataavailable = function(e) {
			chunks.push(e.data);
    }

		recorder.start();
		setTimeout(function() {
			recorder.stop();
		}, 5000);
	})
})
