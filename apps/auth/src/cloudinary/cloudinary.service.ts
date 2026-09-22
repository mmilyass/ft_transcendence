import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";

@Injectable()
export class CloudinaryService {
  async uploadImage(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "profile-pictures",
          },
          (error, result) => {
            if (error) {
              reject(new Error(error.message));
              return;
            }

            resolve(result!.secure_url);
          },
        )
        .end(buffer);
    });
  }
}
