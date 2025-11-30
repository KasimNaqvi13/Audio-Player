table 90001 "Azure Speech Region"
{
    Caption = 'Region';
    DataClassification = ToBeClassified;

    fields
    {
        field(1; Region; Code[20])
        {
            Caption = 'Region';
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
        key(PK; Region)
        {
            Clustered = true;
        }
    }
}
