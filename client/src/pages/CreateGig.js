import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define Zod validation schema
const gigSchema = z.object({
  title: z.string().min(3, "Title is required"),
  desc: z.string().min(10, "Description too short"),
  price: z
    .number({ invalid_type_error: "Price is required" })
    .positive("Price must be positive"),
  category: z.string().min(3, "Category is required"),
  image: z.any()
    .refine((files) => files?.length > 0, "Image is required"),
});

const CreateGig = () => {
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(gigSchema),
  });

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "unsigned_gigs");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dng9wxruc/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const result = await res.json();
    return result.secure_url;
  };

  const onSubmit = async (data) => {
    try {
      setUploading(true);

      // Upload image to Cloudinary
      const imageUrl = await uploadToCloudinary(data.image[0]);

      const payload = {
        title: data.title,
        desc: data.desc,
        price: data.price,
        category: data.category,
        images: [imageUrl],
        userId: JSON.parse(localStorage.getItem("userId")), // Assuming userId is stored in localStorage
      };

      const token = localStorage.getItem("token");
      if (!token) {
  alert("You must be logged in to create a gig");
  return;
}
      const res = await fetch("http://localhost:5000/api/gigs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      alert(result.message || "Gig created!");
      reset(); // clear form
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create a Gig</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="text"
            {...register("title")}
            placeholder="Title"
            className="w-full border p-2 rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div>
          <textarea
            {...register("desc")}
            placeholder="Description"
            className="w-full border p-2 rounded"
          />
          {errors.desc && (
            <p className="text-red-500 text-sm">{errors.desc.message}</p>
          )}
        </div>

        <div>
          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            placeholder="Price"
            className="w-full border p-2 rounded"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            {...register("category")}
            placeholder="Category"
            className="w-full border p-2 rounded"
          />
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>

        <div>
          <input
            type="file"
            {...register("image")}
            accept="image/*"
            className="w-full"
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Create Gig"}
        </button>
      </form>
    </div>
  );
};

export default CreateGig;