page 90002 "Azure Audio Setup"
{
    ApplicationArea = All;
    Caption = 'Azure Audio';
    PageType = Card;
    SourceTable = "Azure Audio Setup";
    UsageCategory = Documents;

    layout
    {
        area(Content)
        {
            group(General)
            {
                Caption = 'General';

                field(Region; Rec.Region)
                {
                    ToolTip = 'Specifies the value of the Region field.', Comment = '%';
                    AccessByPermission = tabledata "Azure Audio Setup" = rimd;
                }
                field(VoiceName; Rec.VoiceName)
                {
                    ToolTip = 'Specifies the value of the Voice Name field.', Comment = '%';
                    AccessByPermission = tabledata "Azure Audio Setup" = rimd;
                }
                field(AzureSpeechKey; AzureSpeechKey)
                {
                    Caption = 'Azure Speech Key';
                    ToolTip = 'Specifies the Azure Speech Key.';
                    ApplicationArea = All;
                    // MaskType = Concealed;
                    trigger OnValidate()
                    begin
                        Rec.SetAzureSpeechKey(AzureSpeechKey);
                    end;
                }
            }
        }
    }

    trigger OnOpenPage()
    begin
        if not Rec.Get() then begin
            Rec.Init();
            Rec."Primary Key" := '';
            Rec.Insert();
        end;

        if Rec.GetAzureSpeechKey() <> '' then
            AzureSpeechKey := '**********'
        else
            AzureSpeechKey := '';
    end;

    var
        [NonDebuggable]
        AzureSpeechKey: Text;
}
