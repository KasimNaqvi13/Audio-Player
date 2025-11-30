page 90004 "Azure Speech Voice"
{
    ApplicationArea = All;
    Caption = 'Azure Speech Voice';
    PageType = List;
    SourceTable = "Azure Speech Voice";
    UsageCategory = Lists;

    layout
    {
        area(Content)
        {
            repeater(General)
            {
                field("Voice Name"; Rec."Voice Name")
                {
                    ToolTip = 'Specifies the value of the Voice Name field.', Comment = '%';
                }
                field(Description; Rec.Description)
                {
                    ToolTip = 'Specifies the value of the Description field.', Comment = '%';
                }
            }
        }
    }
}
