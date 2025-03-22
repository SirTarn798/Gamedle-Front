import { ToastContentProps } from "react-toastify";

export default function Toast(data : {title : string, text : string, bg : string}) {
  return (
      <div className="flex flex-col p-4">
        <h3 className="text-zinc-800 text-sm font-semibold">Email Received</h3>
        <p className="text-sm">You received a new email from somebody</p>
      </div>
  );
}
