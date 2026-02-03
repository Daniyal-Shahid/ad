import { Type, Image } from 'lucide-react';
import { useDesigner } from '../../../context/DesignerContext';

export default function DesignTools() {
    const { addElement } = useDesigner();

    return (
        <div className="w-20 bg-white border-r border-rose-100 flex flex-col items-center py-4 gap-4 z-10 rounded-l-2xl shadow-sm overflow-y-auto">
            {/* Add Elements */}
            <div className="flex flex-col items-center gap-4 w-full px-2">
                <button
                    onClick={() => addElement('text')}
                    className="p-3 text-gray-500 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition flex flex-col items-center gap-1 w-full"
                    title="Add Text"
                >
                    <Type size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Text</span>
                </button>

                <label
                    className="p-3 text-gray-500 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition flex flex-col items-center gap-1 cursor-pointer w-full"
                    title="Add Image"
                >
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => addElement('image', ev.target.result);
                                reader.readAsDataURL(file);
                            }
                        }}
                    />
                    <Image size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Photo</span>
                </label>
            </div>

            <div className="h-px w-10 bg-gray-100"></div>

            {/* Background Tools */}
            <div className="flex flex-col gap-3 items-center w-full px-2">
                <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">BG</div>
                <input
                    type="color"
                    className="w-10 h-10 rounded-lg border-2 border-gray-100 cursor-pointer overflow-hidden p-0 shadow-sm"
                    onChange={(e) => addElement('background', e.target.value)}
                    title="Background Color"
                />
                <label
                    className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition flex flex-col items-center gap-1 cursor-pointer w-full"
                    title="Background Image"
                >
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => addElement('backgroundImage', ev.target.result);
                                reader.readAsDataURL(file);
                            }
                        }}
                    />
                    <Image size={18} />
                    <span className="text-[9px] font-bold uppercase">Image</span>
                </label>
            </div>
        </div>
    );
}
