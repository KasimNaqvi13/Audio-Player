table 90002 "Azure Speech Voice"
{
    Caption = 'Azure Speech Voice';
    DataClassification = ToBeClassified;

    fields
    {
        field(1; "Voice Name"; Code[50])
        {
            Caption = 'Voice Name';
            DataClassification = CustomerContent;
        }
        field(2; Description; Text[1049])
        {
            Caption = 'Description';
            DataClassification = CustomerContent;
        }
    }
    keys
    {
        key(PK; "Voice Name")
        {
            Clustered = true;
        }
    }
}
