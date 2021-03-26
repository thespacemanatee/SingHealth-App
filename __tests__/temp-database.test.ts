import {database} from "../src/data/dummy-database"

test('temporary database checking', () => {
    expect(database).not.toBeUndefined();
    expect(database.audit_forms).not.toBe(null);
    expect(database.audits).not.toBe(null);
    expect(database.institutions).not.toBe(null);
    expect(database.staffs).not.toBe(null);
    expect(database.tenants).not.toBe(null);
  });