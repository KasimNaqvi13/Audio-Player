table 90000 "Azure Audio Setup"
{
    Caption = 'Azure Audio Setup';
    DataClassification = ToBeClassified;

    fields
    {

        field(1; "Primary Key"; Code[10])
        {
            Caption = 'Primary Key';
            AllowInCustomizations = Never;
        }

        field(2; Region; code[20])
        {
            Caption = 'Region';
            DataClassification = CustomerContent;
            TableRelation = "Azure Speech Region".Region;
        }
        field(3; VoiceName; Code[50])
        {
            Caption = 'Voice Name';
            DataClassification = CustomerContent;
            TableRelation = "Azure Speech Voice"."Voice Name";
        }
    }
    keys
    {
        key(PK; "Primary Key")
        {
            Clustered = true;
        }
    }

    trigger OnDelete()
    begin
        DeleteAzureSpeechKey();
    end;


    procedure GetAzureKeyName(): Text
    begin
        exit(Region + '-' + VoiceName);
    end;


    procedure GetAzureSpeechKey() AzureSpeechKey: Text
    begin
        if IsolatedStorage.Contains(GetAzureKeyName(), DataScope::Company) then
            if IsolatedStorage.Get(GetAzureKeyName(), DataScope::Company, AzureSpeechKey) then
                exit(AzureSpeechKey);
    end;


    procedure SetAzureSpeechKey(NewKey: Text)
    begin
        if IsolatedStorage.Contains(GetAzureKeyName(), DataScope::Company) then
            IsolatedStorage.Delete(GetAzureKeyName(), DataScope::Company);

        IsolatedStorage.Set(GetAzureKeyName(), NewKey, DataScope::Company);
    end;

    procedure DeleteAzureSpeechKey()
    begin
        if IsolatedStorage.Contains(GetAzureKeyName(), DataScope::Company) then
            IsolatedStorage.Delete(GetAzureKeyName(), DataScope::Company);
    end;
}