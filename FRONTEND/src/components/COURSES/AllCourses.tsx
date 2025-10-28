// Full working React code (AllCourses.tsx)
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import PageMeta from "../common/PageMeta";
import PageBreadcrumb from "../common/PageBreadCrumb";
import { ArrowLeft, PlusIcon, Trash2 } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
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
    const [courses, setCourses] = useState([]);
 
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
                body: formData,
            });
 
            const result = await response.json();
 
            if (response.ok) {
                alert("Course added successfully!");
                closeModal();
                setCourseName("");
                setDuration("");
                setOverview("");
                setSelectedFile(null);
 
                // ⏱️ Option 1: Re-fetch from backend (already works)
                // fetchCourses();
 
                // ✅ Option 2: Add new course directly to state
                if (result?.newCourse) {
                    setCourses((prevCourses) => [...prevCourses, result.newCourse]);
                } else {
                    // fallback if backend doesn't return newCourse
                    fetchCourses();
                }
            } else {
                alert(result?.message || "Something went wrong.");
            }
        } catch (error) {
            console.error("Error adding course:", error);
            alert("Failed to add course.");
        }
    };
 
 
 
    const fetchCourses = async () => {
        try {
            const response = await fetch("https://nystai-backend.onrender.com/Allcourses/get-all-courses");
            const data = await response.json();
            setCourses(data?.allCourses || []);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };
 
    useEffect(() => {
        fetchCourses();
    }, []);
 
    useEffect(() => {
        console.log("Updated courses:", courses);
    }, [courses]);
 
 
    return (
        <>
            <PageMeta title="All Courses - Nystai Institute" description="All available courses" />
            <PageBreadcrumb pageTitle="All Course" />
 
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">All Courses</h3>
                    <button
                        onClick={openModal}
                        className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800"
                    >
                        <PlusIcon className="size-5 text-gray-800" />
                        Add Course
                    </button>
                </div>
 
                {/* ✅ Modal for Adding New Course */}
                <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                    <div className="w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                        <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90 text-center">Add Course Form</h4>
                        <form className="flex flex-col mt-5" onSubmit={(e) => e.preventDefault()}>
                            <div className="custom-scrollbar h-[350px] overflow-y-auto px-2 pb-3">
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
                                    <div className="lg:col-span-2">
                                        <Label className="mb-3">Upload Image</Label>
                                        <FileUploadBox selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-center">
                                <button onClick={closeModal} className="px-4 py-2 rounded-2xl border border-[#F8C723] text-gray-800">
                                    <ArrowLeft className="size-5 text-[#F8C723]" />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-20 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800"
                                >
                                    Add New Course
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
 
                {/* ✅ Course Cards List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 p-6">
                    {courses.map((course) => (
                        <div key={course._id} className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                            <img
                                src={course.image_url || "https://via.placeholder.com/300x200?text=No+Image"}
                                alt="Course"
                                className="w-full h-[200px] object-cover object-center"
                            />
                            <div className="p-5 flex flex-col justify-between">
                                <p className="text-xs font-bold uppercase mb-3">{course.course_name}</p>
                                <p className="text-sm mb-2"><strong>Duration:</strong> {course.course_duration}</p>
                                <p className="text-sm mb-4"><strong>Overview:</strong> {course.card_overview}</p>
                                <Link
                                    to={`/course/${course._id}`}
                                    className="flex justify-center items-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
 
// 🔽 Upload Box Component
function FileUploadBox({ selectedFile, setSelectedFile }) {
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setSelectedFile(acceptedFiles[0]);
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
                <button onClick={handleDelete} className="text-gray-500 hover:text-red-500">
                    <Trash2 size={18} />
                </button>
            </div>
        );
    }
 
    return (
        <div {...getRootProps()} className={`transition border border-gray-300 border-dashed cursor-pointer rounded-xl h-[200px] p-7 lg:p-10 ${isDragActive ? "bg-gray-100" : "bg-gray-50"}`}>
            <input {...getInputProps()} />
            <div className="flex flex-col justify-center items-center text-center h-full gap-2">
                <img src={Upload} alt="Upload Icon" className="h-12 w-12 object-contain" />
                <p className="text-sm">
                    {isDragActive ? "Drop Files or" : "Drag & Drop Files or"}{" "}
                    <span className="font-medium underline text-brand-500">Browse File</span>
                </p>
                <span className="text-sm text-gray-700">Supported: JPEG, PNG, GIF, PDF, MP4, etc.</span>
            </div>
        </div>
    );
}