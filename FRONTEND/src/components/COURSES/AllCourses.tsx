// ✅ Updated AllCourses.tsx with Add Course API Integration
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import PageMeta from "../common/PageMeta";
import PageBreadcrumb from "../common/PageBreadCrumb";
import { ArrowLeft, PlusIcon, Trash2 } from "lucide-react";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router";
import Upload from "../../../src/icons/Upload icon.png";
import Uploadafter from "../../../src/icons/OIP.webp";

export default function AllCourses() {
    const { isOpen, openModal, closeModal } = useModal();
    const [courseName, setCourseName] = useState("");
    const [duration, setDuration] = useState("");
    const [overview, setOverview] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleSave = async () => {
        if (!courseName || !duration || !overview || !selectedFile) {
            alert("Please fill all fields and upload an image.");
            return;
        }

        const formData = new FormData();
        formData.append("course_name", courseName);
        formData.append("course_duration", duration);
        formData.append("card_overview", overview);
        formData.append("image_url", selectedFile);

        try {
            const response = await fetch("https://nystai-backend.onrender.com/Allcourses/add", {
                method: "POST",
                body: formData
            });

            const contentType = response.headers.get("content-type");
            console.log("STATUS", response.status);
            console.log("CONTENT-TYPE", contentType);

            let result;
            try {
                result = await response.json();
            } catch (jsonError) {
                const text = await response.text();
                console.warn("Failed to parse JSON. Raw response:", text);
                throw new Error("Invalid JSON response");
            }

            if (response.status === 200 || response.status === 201) {
                alert("Course added successfully!");
                closeModal();
                setCourseName("");
                setDuration("");
                setOverview("");
                setSelectedFile(null);
            } else {
                alert(result?.message || "Something went wrong.");
            }
        } catch (error) {
            console.error("Caught error in fetch:", error);
            alert("Failed to add course.");
        }

    };

    return (
        <>
            <PageMeta
                title="Nystai Institute | CCTV & Home Automation Course Training"
                description="Join Nystai Institute to master CCTV installation and home automation systems. Get hands-on training, expert guidance, and industry-ready skills for a successful tech career."
            />
            <PageBreadcrumb pageTitle="All Course" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="mb-5 flex items-center justify-between lg:mb-7">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        All Courses
                    </h3>
                    <button
                        onClick={openModal}
                        className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                        <PlusIcon className="size-5 text-gray-800 dark:text-white/90" />
                        Add Course
                    </button>
                    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                            <div className="px-2 pr-14">
                                <h4 className="mb-2 justify-center text-2xl font-semibold text-gray-800 dark:text-white/90">
                                    Add Course Form
                                </h4>
                            </div>
                            <form className="flex flex-col mt-5">
                                <div className="custom-scrollbar h-[350px] overflow-y-auto px-2 pb-3">
                                    <div>
                                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                            <div>
                                                <Label className="mb-3">Course Name</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="System Integration Program"
                                                    value={courseName}
                                                    onChange={(e) => setCourseName(e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <Label className="mb-3">Course Duration</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="7 Days"
                                                    value={duration}
                                                    onChange={(e) => setDuration(e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <Label className="mb-3">Course Overview</Label>
                                                <textarea
                                                    placeholder="Course Overview"
                                                    className="w-full border rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-theme-xs  px-3 py-2 h-[200px] resize-none text-sm text-gray-700 placeholder:text-gray-400"
                                                    value={overview}
                                                    onChange={(e) => setOverview(e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <Label className="mb-3">Upload Images</Label>
                                                <FileUploadBox
                                                    selectedFile={selectedFile}
                                                    setSelectedFile={setSelectedFile}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-center">
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 rounded-2xl border border-[#F8C723] text-gray-800 dark:text-white/90"
                                    >
                                        <ArrowLeft className="size-5 text-[#F8C723]" />
                                    </button>

                                    <button
                                        type="button"
                                        className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-20 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                                        onClick={handleSave}
                                    >
                                        Add New Course
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                </div>
                {/* Static course card rendering remains here for now */}
            </div>
        </>
    );
}

function FileUploadBox({ selectedFile, setSelectedFile }) {
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setSelectedFile(file);
        }
    }, [setSelectedFile]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
    });

    const handleDelete = () => setSelectedFile(null);

    if (selectedFile) {
        const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(1);
        return (
            <div className="bg-white flex justify-between items-center px-4 py-3 rounded-xl shadow border h-[200px]">
                <div className="flex items-center gap-4">
                    <img src={Uploadafter} alt="Preview" className="h-12 w-12 object-contain" />
                    <div>
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">{fileSizeMB} MB</p>
                    </div>
                </div>
                <button onClick={handleDelete} className="text-gray-500 hover:text-red-500 transition">
                    <Trash2 size={18} />
                </button>
            </div>
        );
    }

    return (
        <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500 h-[200px]">
            <form
                {...getRootProps()}
                className={`dropzone h-full rounded-xl border-dashed border-gray-300 p-7 lg:p-10 ${isDragActive
                    ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                    : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                    }`}
                id="demo-upload"
            >
                <input {...getInputProps()} />
                <div className="dz-message flex flex-col justify-center items-center text-center h-full gap-2">
                    <div className="flex justify-center items-center">
                        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                            <img src={Upload} alt="Upload Icon" className="h-12 w-12 object-contain" />
                        </div>
                    </div>
                    <div className="max-w-[400px]">
                        <h6 className="mb-2 text-sm font-sl text-gray dark:text-white/90">
                            {isDragActive ? "Drop Files or" : "Drag & Drop Files or"} <span className="font-medium underline text-brand-500 text-xs">Browse File</span>
                        </h6>
                        <span className="block text-sm text-gray-700 dark:text-gray-400">
                            Supported formats: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
                        </span>
                    </div>
                </div>
            </form>
        </div>
    );
}