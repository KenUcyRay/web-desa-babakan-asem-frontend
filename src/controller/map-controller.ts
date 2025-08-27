import { MapService } from "./../service/map-service";
import { UserRequest } from "@/type/user-request";
import { Response, NextFunction } from "express";

export class MapController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      console.log('=== MAP CREATE REQUEST ===');
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      console.log('User:', req.user);
      
      const response = await MapService.create(req.body, req.file);
      
      console.log('=== MAP CREATE RESPONSE ===');
      console.log('Response:', response);
      
      res.status(201).json(response);
    } catch (error) {
      console.log('=== MAP CREATE ERROR ===');
      console.log('Error:', error);
      next(error);
    }
  }

  static async getAll(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await MapService.getAll();
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      console.log('=== MAP UPDATE REQUEST ===');
      console.log('Map ID:', req.params.id);
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      console.log('User:', req.user);
      
      const response = await MapService.update(req.params.id, req.body, req.file);
      
      console.log('=== MAP UPDATE RESPONSE ===');
      console.log('Response:', response);
      
      res.status(200).json(response);
    } catch (error) {
      console.log('=== MAP UPDATE ERROR ===');
      console.log('Error:', error);
      next(error);
    }
  }

  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      await MapService.delete(req.params.id);
      res.status(200).json({ ok: true });
    } catch (error) {
      next(error);
    }
  }
}
