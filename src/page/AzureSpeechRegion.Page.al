page 90003 "Azure Speech Region"
{
    ApplicationArea = All;
    Caption = 'Azure Speech Region';
    PageType = List;
    SourceTable = "Azure Speech Region";
    UsageCategory = Lists;

    layout
    {
        area(Content)
        {
            repeater(General)
            {
                field(Region; Rec.Region)
                {
                    ToolTip = 'Specifies the value of the Region field.', Comment = '%';
                }
                field(Description; Rec.Description)
                {
                    ToolTip = 'Specifies the value of the Description field.', Comment = '%';
                }
            }
        }
    }
}
