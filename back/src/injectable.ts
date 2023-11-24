import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class parseBooleanPipe implements PipeTransform<string, boolean> {
  transform(value: string, metadata: ArgumentMetadata): boolean {
    if (value.toLowerCase() === 'true')
      return true;
    else if (value.toLowerCase() === 'false')
      return false;
    else
      throw new BadRequestException('Invalid boolean value');
  }
}

@Injectable()
export class numberValidityPipe implements PipeTransform {
  transform(value: number, metadata: ArgumentMetadata) {
    if (!value || value == null || value > 1000000 || value < -1000000)
      throw new BadRequestException('Invalid number Value');
    return value;
  }
}

@Injectable()
export class stringExistNotNullPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!value || value == null || value.length > 500) // remove 500 next
      throw new BadRequestException('Invalid String Value');
    return value;
  }
}

@Injectable()
export class stringExistNotNullNotTooLongPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!value || value == null || value.length > 100)
      throw new BadRequestException('Invalid String Value');
    return value;
  }
}