import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center animate-spin fixed">
      <Loader2 width={100} height={100} color="#057cce" />
    </div>
  );
};

export default Loading;
