import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import PageMeta from "../common/PageMeta";
import PageBreadcrumb from "../common/PageBreadCrumb";
import { ArrowLeft, PlusIcon } from "lucide-react";
import cardimg1 from "../../../public/images/AllCourse/course01.png";
import cardimg2 from "../../../public/images/AllCourse/course02.png";
import cardimg3 from "../../../public/images/AllCourse/course03.png";
import cardimg4 from "../../../public/images/AllCourse/course04.png";
import { Link } from "react-router";

export default function AllCourses() {
    const { isOpen, openModal, closeModal } = useModal();
    const handleSave = () => {
        console.log("Saving changes...");
        closeModal();
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
                                                />
                                            </div>

                                            <div>
                                                <Label className="mb-3">Course Duration</Label>
                                                <Input type="text" placeholder="System Integration Program" />
                                            </div>

                                            <div>
                                                <Label className="mb-3">Course Overview</Label>
                                                <textarea
                                                    placeholder="System Integration Program"
                                                    className="w-full border rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-theme-xs  px-3 py-2 h-[200px] resize-none text-sm text-gray-700 placeholder:text-gray-400"
                                                />

                                            </div>
                                            <div>
                                                <Label className="mb-3">Upload Images</Label>
                                                <FileUploadBox/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-center">
                                    {/* Left Arrow Button with Custom Border Color */}
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 rounded-2xl border border-[#F8C723] text-gray-800 dark:text-white/90"
                                    >
                                        <ArrowLeft className="size-5 text-[#F8C723]" />
                                    </button>


                                    {/* Submit Button with Custom Background Color */}
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

                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 p-6">
                        <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
                            {/* Image - full height and aspect ratio maintained */}
                            <img
                                src={cardimg1}
                                alt="Card image"
                                className="w-full object-cover object-center"
                            />

                            {/* Content */}
                            <div className="p-5 flex flex-col justify-between">
                                {/* Category label */}
                                <a
                                    href="#"
                                    className="text-xs font-bold uppercase inline-block mb-3"
                                >
                                    System Integration Program
                                </a>

                                {/* Key:Value Title */}
                                <div className="mb-2">
                                    <span className="text-ml font-semibold text-gray-700 dark:text-white/90">Duration&nbsp;&nbsp;&nbsp;:</span>{' '}
                                    <span className="text-sm text-gray-800 dark:text-gray-300">7 Days</span>
                                </div>

                                {/* Key:Value Description */}
                                <div className="mb-4">
                                    <span className="text-ml font-semibold text-gray-700 dark:text-white/90">Overview&nbsp;:</span>{' '}
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Understand IoT principles, device communication, & sensor integration. Ideal for beginners.
                                    </span>
                                </div>


                                {/* Button - white background, full width, centered text */}
                                <Link
                                    to="/course1"
                                    className="flex justify-center items-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:text-gray-800 dark:border-gray-700 dark:bg-white dark:text-gray-800 dark:hover:bg-white/90"
                                >
                                    Learn More
                                </Link>

                            </div>
                        </div>
                        <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
                            {/* Image - full height and aspect ratio maintained */}
                            <img
                                src={cardimg2}
                                alt="Card image"
                                className="w-full object-cover object-center"
                            />

                            {/* Content */}
                            <div className="p-5 flex flex-col justify-between">
                                {/* Category label */}
                                <a
                                    href="#"
                                    className="text-xs font-bold uppercase inline-block mb-3"
                                >
                                    IoT Application & Deployment
                                </a>

                                {/* Key:Value Title */}
                                <div className="mb-2">
                                    <span className="text-ml font-semibold text-gray-700 dark:text-white/90">Duration&nbsp;&nbsp;&nbsp;:</span>{' '}
                                    <span className="text-sm text-gray-800 dark:text-gray-300">7 Days</span>
                                </div>

                                {/* Key:Value Description */}
                                <div className="mb-4">
                                    <span className="text-ml font-semibold text-gray-700 dark:text-white/90">Overview&nbsp;:</span>{' '}
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Understand IoT principles, device communication, & sensor integration. Ideal for beginners.
                                    </span>
                                </div>


                                {/* Button - white background, full width, centered text */}
                                <button
                                    className="flex justify-center items-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:text-gray-800 dark:border-gray-700 dark:bg-white dark:text-gray-800 dark:hover:bg-white/90"
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                        <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
                            {/* Image - full height and aspect ratio maintained */}
                            <img
                                src={cardimg3}
                                alt="Card image"
                                className="w-full object-cover object-center"
                            />

                            {/* Content */}
                            <div className="p-5 flex flex-col justify-between">
                                {/* Category label */}
                                <a
                                    href="#"
                                    className="text-xs font-bold uppercase inline-block mb-3"
                                >
                                    Embedded Systems
                                </a>

                                {/* Key:Value Title */}
                                <div className="mb-2">
                                    <span className="text-ml font-semibold text-gray-700 dark:text-white/90">Duration&nbsp;&nbsp;&nbsp;:</span>{' '}
                                    <span className="text-sm text-gray-800 dark:text-gray-300">7 Days</span>
                                </div>

                                {/* Key:Value Description */}
                                <div className="mb-4">
                                    <span className="text-ml font-semibold text-gray-700 dark:text-white/90">Overview&nbsp;:</span>{' '}
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Understand IoT principles, device communication, & sensor integration. Ideal for beginners.
                                    </span>
                                </div>


                                {/* Button - white background, full width, centered text */}
                                <button
                                    className="flex justify-center items-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:text-gray-800 dark:border-gray-700 dark:bg-white dark:text-gray-800 dark:hover:bg-white/90"
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                        <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
                            {/* Image - full height and aspect ratio maintained */}
                            <img
                                src={cardimg4}
                                alt="Card image"
                                className="w-full object-cover object-center"
                            />

                            {/* Content */}
                            <div className="p-5 flex flex-col justify-between">
                                {/* Category label */}
                                <a
                                    href="#"
                                    className="text-xs font-bold uppercase inline-block mb-3"
                                >
                                    Networking & Infrastructure
                                </a>

                                {/* Key:Value Title */}
                                <div className="mb-2">
                                    <span className="text-ml font-semibold text-gray-700 dark:text-white/90">Duration&nbsp;&nbsp;&nbsp;:</span>{' '}
                                    <span className="text-sm text-gray-800 dark:text-gray-300">7 Days</span>
                                </div>

                                {/* Key:Value Description */}
                                <div className="mb-4">
                                    <span className="text-ml font-semibold text-gray-700 dark:text-white/90">Overview&nbsp;:</span>{' '}
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Understand IoT principles, device communication, & sensor integration. Ideal for beginners.
                                    </span>
                                </div>


                                {/* Button - white background, full width, centered text */}
                                <button
                                    className="flex justify-center items-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:text-gray-800 dark:border-gray-700 dark:bg-white dark:text-gray-800 dark:hover:bg-white/90"
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Trash2 } from "lucide-react";
import Upload from "../../../src/icons/Upload icon.png";
import Uploadafter from "../../../src/icons/OIP.webp";

function FileUploadBox() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setSelectedFile(file);
        }
    }, []);

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
                <button
                    onClick={handleDelete}
                    className="text-gray-500 hover:text-red-500 transition"
                >
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
                    {/* Icon Container */}
                    <div className="flex justify-center items-center">
                        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                            <img src={Upload} alt="Upload Icon" className="h-12 w-12 object-contain" />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="max-w-[400px]">
                        <h6 className="mb-2 text-sm font-sl text-gray dark:text-white/90">
                            {isDragActive ? "Drop Files or" : "Drag & Drop Files or"}{" "}
                            <span className="font-medium underline text-brand-500 text-xs">
                                Browse File
                            </span>
                        </h6>

                        <span className="block text-sm text-gray-700 dark:text-gray-400">
                            Supported formates: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
                        </span>
                    </div>
                </div>

            </form>
        </div>
    );
}


