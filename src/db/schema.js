import {appSchema, tableSchema} from '@nozbe/watermelondb';

const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'assets',
      columns: [{name: 'assets', type: 'string'}],
    }),
  ],
});

export default schema;
