controladdin "Audio Player"
{
    StartupScript = '.\src\scripts\PlayerStartup.js';
    Scripts = '.\src\scripts\Player.js';
    StyleSheets = '.\src\StyleSheets\styleplayer.css';
    HorizontalStretch = true;
    VerticalStretch = true;
    HorizontalShrink = true;
    VerticalShrink = true;
    RequestedHeight = 160;


    event ControlReady();
    procedure LoadAudio(AudioUrl: Text; AzureKey: Text; AzureRegion: Text; VoiceName: Text);
    procedure Play();
    procedure Pause();
    procedure SetVolume(Volume: Decimal);
    event PlaybackEnded();
}