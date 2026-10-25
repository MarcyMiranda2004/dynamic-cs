import type React from "react";
import type {BaseSheet} from "../../types/sheet";


const SheetDetailPage: React.FC<{ sheet: BaseSheet }> = ({ sheet }) => {
    const sheetId = sheet.id;
    const sheetGameSystem = sheet.gameSystem;

    return (
        <div className="dcs-container">

        </div>
    )
};
export default SheetDetailPage