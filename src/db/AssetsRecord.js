import {Model} from '@nozbe/watermelondb';
import {json} from '@nozbe/watermelondb/decorators';

export default class AssetsRecord extends Model {
  static table = 'assets';
  @json('assets') assets;
}
