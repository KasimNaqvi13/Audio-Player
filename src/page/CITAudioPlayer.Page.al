page 90000 "CIT Audio Player"
{
    PageType = CardPart;
    Editable = false;
    InsertAllowed = false;
    ModifyAllowed = false;
    DeleteAllowed = false;
    Caption = 'Audio Player';

    layout
    {
        area(Content)
        {
            field(AudioPlayerControl; '')
            {
                ApplicationArea = All;
                ShowCaption = false;

                trigger OnAssistEdit()
                begin
                    LoadAudioFile();
                end;
            }

            usercontrol(AudioPlayer; "Audio Player")
            {
                ApplicationArea = All;

                trigger ControlReady()
                begin
                    Message('Audio player control is ready.');
                    LoadAudioFile();
                end;

                trigger PlaybackEnded()
                begin
                    Message('Audio playback has ended.');
                end;
            }
        }
    }

    actions
    {
        area(Processing)
        {
            action(PlayPause)
            {
                ApplicationArea = All;
                Caption = 'Play';
                Image = Pause;

                trigger OnAction()
                begin
                    Message('Playing audio...');
                    CurrPage.AudioPlayer.Play();
                end;
            }

            action(Reload)
            {
                ApplicationArea = All;
                Caption = 'Reload Audio';
                Image = Refresh;

                trigger OnAction()
                begin
                    Message('Reloading audio...');
                    LoadAudioFile();
                end;
            }
        }
    }

    var
        toSpeak: Text;

    local procedure LoadAudioFile()
    var
        AzureSpeechSetup: Record "Azure Audio Setup";
    begin
        AzureSpeechSetup.Get();
        CurrPage.AudioPlayer.LoadAudio(toSpeak, AzureSpeechSetup.GetAzureSpeechKey(), AzureSpeechSetup.Region, AzureSpeechSetup.VoiceName);
    end;

    procedure LoadContent(Summary: Text)
    begin
        toSpeak := Summary;
    end;

}