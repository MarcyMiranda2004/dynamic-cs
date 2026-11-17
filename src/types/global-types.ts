export interface ActionLinkButton {
    id: string;
    label: string;
    icon?: React.ReactElement;
    destination: string;
    disabled?: boolean;
    function?: () => void | Promise<void>;
};