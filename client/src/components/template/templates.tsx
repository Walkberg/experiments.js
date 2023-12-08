import { ReactNode } from "react";
import { Outlet } from "react-router";

interface PageTemplateProps {
sidebar:ReactNode;
}

export const PageTemplate = ({sidebar}:PageTemplateProps) => {

    return (
        <div>
            <div>
                {sidebar}
            </div>
            <div>
                <Outlet/>
            </div>
        </div>
    )
}