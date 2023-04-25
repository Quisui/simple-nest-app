import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Car } from './interfaces/car.interface';
import { v4 as uuid } from 'uuid';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
@Injectable()
export class CarsService {
  private cars: Car[] = [
    {
      id: uuid(),
      brand: 'Toyota',
      model: 'Corolla',
    },
    {
      id: uuid(),
      brand: 'Honda',
      model: 'civic',
    },
  ];

  findAll() {
    return this.cars;
  }

  findById(id: string) {
    const car = this.cars.find((car) => car.id === id);

    if (!car) {
      throw new NotFoundException('Id was not found in our records');
    }
    return car;
  }

  async create<T>({ model, brand }: CreateCarDto): Promise<T> {
    const car: Car = {
      id: uuid(),
      brand: brand,
      model: model,
    };

    await this.cars.push(car);

    return car as T;
  }

  async update<T>(id: string, updateCarDto: UpdateCarDto): Promise<T> {
    let carDB = this.findById(id);

    if (updateCarDto.id && updateCarDto.id !== id)
      throw new BadRequestException(
        'The car that you want to update is not the same requested',
      );

    const index = this.cars.findIndex((car) => car.id === id);
    carDB = {
      ...carDB,
      ...updateCarDto,
      id,
    };
    this.cars[index] = carDB;

    return carDB as T;
  }

  delete(id): void {
    const car = this.findById(id);
    this.cars = this.cars.filter((car) => car.id !== id);
  }

  fillCarsWIthSeedData(cars: Car[]) {
    this.cars = cars;
  }
}
