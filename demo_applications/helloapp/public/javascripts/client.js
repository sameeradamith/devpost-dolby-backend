const url = new URL(window.location.href);
const username = url.searchParams.get("name");


const main = async () => {
  /* Event handlers */

  // When a stream is added to the conference
  VoxeetSDK.conference.on('streamAdded', (participant, stream) => {
    if (stream.type === 'ScreenShare') {
      return addScreenShareNode(stream);
    }

    if (stream.getVideoTracks().length) {
      // Only add the video node if there is a video track
      addVideoNode(participant, stream);
    }

    addParticipantNode(participant);
  });

  // When a stream is updated
  VoxeetSDK.conference.on('streamUpdated', (participant, stream) => {
    if (stream.type === 'ScreenShare') return;

    if (stream.getVideoTracks().length) {
      // Only add the video node if there is a video track
      addVideoNode(participant, stream);
    } else {
      removeVideoNode(participant);
    }
  });

  // When a stream is removed from the conference
  VoxeetSDK.conference.on('streamRemoved', (participant, stream) => {
    if (stream.type === 'ScreenShare') {
      return removeScreenShareNode();
    }

    removeVideoNode(participant);
    removeParticipantNode(participant);
  });

  try {
    // Initialize the Voxeet SDK
    // WARNING: It is best practice to use the VoxeetSDK.initializeToken function to initialize the SDK.
    // Please read the documentation at:
    // https://docs.dolby.io/communications-apis/docs/initializing-javascript
    VoxeetSDK.initialize('consumer_key', 'consumer_secret');

    // Open a session for the user
    await VoxeetSDK.session.open({ name: username });

    // Initialize the UI
    initUI();
  } catch (e) {
    alert('Something went wrong : ' + e);
  }
}

main();
