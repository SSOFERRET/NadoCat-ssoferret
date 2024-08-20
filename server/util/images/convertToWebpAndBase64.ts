import sharp from "sharp";

const RESIZE_WIDTH = 1080;
const MAXIMUM_MB = 1 * 1024 * 1024;
const QUALITY_DEGREE = 5;

export const convertToWebpAndBase64 = async (data: Express.Multer.File, quality: number = 90): Promise<Buffer> => {
  try {
    if (quality <= 30)
      throw new Error("quality must be > 30");

    const image = sharp(data.buffer);
    const width: number = await image.metadata().then((metadata) => {
      if (!metadata.width)
        throw new Error("where is image width??")
      return metadata.width;
    });

    const webpBuffer: Buffer = await image.resize(width > RESIZE_WIDTH ? RESIZE_WIDTH : null).webp({ quality }).toBuffer();

    if (webpBuffer.byteLength > MAXIMUM_MB) {
      const reduceQuality: number = quality - QUALITY_DEGREE;
      return await convertToWebpAndBase64(data, reduceQuality);
    }
    console.log(webpBuffer)
    return webpBuffer;
  } catch (error) {
    throw error;
  }
}