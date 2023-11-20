import { Toaster } from "react-hot-toast";

export default function Notification() {
    return (
        <Toaster
            position="bottom-right"
            containerStyle={{
                fontSize: "1.5rem",
                padding: "1.5rem",
            }}
        />
    );
}
