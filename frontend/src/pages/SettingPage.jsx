import { useEffect } from "react";
import Cookies from "js-cookie";
import { ThemeSet } from "../store/ThemeStore";
import { THEMES } from "../Themes/themes";
import { Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SettingPage() {
  const navigate = useNavigate();
  useEffect(() => {
        const token = Cookies.get("chatApp");
        if (token && token !== "undefined" && token !== "null") {
          return
        }else{
          navigate("/login")
        }
      }, []);
      
      const previewMessage = [
    { id: 1, msg: "Hey, how are you?", isSent: false },
    { id: 2, msg: "I am good, what about you?", isSent: true }
  ];
  const { theme, setTheme } = ThemeSet();

  return (
    <div className="h-full p-4 overflow-y-auto">
      <div className="border rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Themes Section */}
        <div>
          <h1 className="text-3xl font-semibold">
            The<span className="text-primary">me's</span>
          </h1>
          <p className="text-sm ml-1 mt-1 text-base-content/70">Choose The Theme</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            {THEMES.map((item, index) => (
              <button
                key={index}
                className={`rounded-xl transition-colors p-1 capitalize ${theme === item ? "bg-secondary" : "hover:bg-primary/20"
                  }`}
                onClick={() => setTheme(item)}
              >
                <div className="relative w-full rounded-md border p-2 text-center" data-theme={item}>
                  {theme===item? <span>{item} ✔️</span>  : item} 
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Preview */}
        <div>
          <h1 className="text-3xl font-semibold">
            Chat<span className="text-primary"> Preview</span>
          </h1>

          <div className="mt-4 bg-base-100 rounded-2xl border shadow-md ">
            {/* Chat Header */}
            <div className="px-4 py-3 border-b flex items-center gap-3 bg-base-100 rounded-2xl">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                <div className="avatar w-full">
                  <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring-2 ring-offset-2">
                    <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm">Syed Sohail</h3>
                <p className="text-xs text-base-content/70">Online</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto">
              {previewMessage.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`
                      max-w-[80%] rounded-xl p-3 shadow-sm border
                      ${message.isSent ? "bg-primary text-primary-content border-primary" : "bg-base-200 border-base-300"}
                    `}
                  >
                    <p className="text-sm max-sm:text-[10px]">{message.msg}</p>
                    <p
                      className={`text-[10px] mt-1.5 max-sm:text-[8px] ${message.isSent ? "text-primary-content/70" 
                        : "text-base-content/70"
                        }`}
                    >
                      12:00 PM
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t flex items-center gap-2 bg-base-100 rounded-2xl">
              <input
                type="text"
                className="input input-bordered flex-1 text-sm h-10"
                placeholder="Type a message..."
                value="This is a preview"
                readOnly
              />
              <button className="btn btn-primary h-10 min-h-0">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
