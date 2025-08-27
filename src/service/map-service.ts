import fs from "fs/promises";
import path from "path";
import { prismaClient } from "@/application/database";
import { ResponseError } from "@/error/response-error";
import { CreateMapRequest, UpdateMapRequest } from "@/model/map-model";
import { MapValidation } from "@/validation/map-validation";
import { Validation } from "@/validation/validation";
import { MapType } from "@prisma/client";

export class MapService {
  static async create(body: CreateMapRequest, icon?: Express.Multer.File) {
    console.log('=== MAP SERVICE CREATE ===');
    console.log('Raw body:', body);
    console.log('Icon file:', icon);
    
    const bodyValidation = Validation.validate(MapValidation.createMap, body);
    
    console.log('Validated body:', bodyValidation);

    if (bodyValidation.type === MapType.POLYGON && icon) {
      throw new ResponseError(400, "Icon is not required for polygon maps");
    } else if ((bodyValidation.type === MapType.MARKER || bodyValidation.type === MapType.BENCANA) && !icon) {
      throw new ResponseError(400, "Icon is required for marker and bencana maps");
    } else if (icon) {
      bodyValidation.icon = icon.filename;
    } else {
      bodyValidation.icon = undefined;
    }

    console.log('Creating map with data:', bodyValidation);
    
    const map = await prismaClient.map.create({
      data: bodyValidation,
    });
    
    console.log('Created map:', map);

    return { ok: true, data: { id: map.id } };
  }
  static async getAll() {
    const maps = await prismaClient.map.findMany({
      orderBy: {
        year: "desc",
      },
    });

    return { ok: true, data: maps };
  }

  static async update(id: string, body: UpdateMapRequest, icon?: Express.Multer.File) {
    console.log('=== MAP SERVICE UPDATE ===');
    console.log('Map ID:', id);
    console.log('Raw body:', body);
    console.log('Icon file:', icon);
    
    const bodyValidation = Validation.validate(MapValidation.updateMap, body);
    
    console.log('Validated body:', bodyValidation);

    const existingMap = await prismaClient.map.findUnique({
      where: { id },
    });

    if (!existingMap) {
      throw new ResponseError(404, "Map not found");
    }

    if (bodyValidation.type === MapType.POLYGON && icon) {
      throw new ResponseError(400, "Icon is not required for polygon maps");
    } else if ((bodyValidation.type === MapType.MARKER || bodyValidation.type === MapType.BENCANA) && !icon && !existingMap.icon) {
      throw new ResponseError(400, "Icon is required for marker and bencana maps");
    }

    // Handle icon update
    if (icon) {
      // Delete old icon if exists
      if (existingMap.icon) {
        const oldFilePath = path.join(
          __dirname,
          "..",
          "..",
          "public",
          "images",
          existingMap.icon
        );
        try {
          await fs.unlink(oldFilePath);
        } catch (error) {
          // Ignore if file doesn't exist
        }
      }
      bodyValidation.icon = icon.filename;
    } else if (bodyValidation.type === MapType.POLYGON) {
      // Remove icon for polygon type
      if (existingMap.icon) {
        const oldFilePath = path.join(
          __dirname,
          "..",
          "..",
          "public",
          "images",
          existingMap.icon
        );
        try {
          await fs.unlink(oldFilePath);
        } catch (error) {
          // Ignore if file doesn't exist
        }
      }
      bodyValidation.icon = undefined;
    } else {
      // Keep existing icon
      bodyValidation.icon = existingMap.icon || undefined;
    }

    console.log('Updating map with data:', bodyValidation);
    
    const updatedMap = await prismaClient.map.update({
      where: { id },
      data: bodyValidation,
    });
    
    console.log('Updated map:', updatedMap);

    return {
      ok: true,
      message: "Data berhasil diupdate",
      data: updatedMap
    };
  }

  static async delete(id: string) {
    const map = await prismaClient.map.findUnique({
      where: { id },
    });

    if (!map) {
      throw new ResponseError(404, "Map not found");
    }

    await prismaClient.map.delete({
      where: { id },
    });
    if (map.icon) {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "images",
        map.icon
      );

      await fs.unlink(filePath);
    }
  }

}
