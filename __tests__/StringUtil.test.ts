import { equals, isBlank, isEmpty, reverse, trim } from '../src/utilities/StringUtils';

test('test equals', () => {
  const a = '123';
  const b = '123';
  expect(equals(a, b)).toBeTruthy();
});

test('test isBlank', () => {
  const a = '  ';
  expect(isBlank(a)).toBeTruthy();
});

test('test isEmpty', () => {
  const a = '';
  expect(isEmpty(a)).toBeTruthy();
});

test('test reverse', () => {
  const a = 'abc';
  expect(reverse(a)).toBe('cba');
});

test('test trim', () => {
  const a = 'a b c';
  expect(trim(a)).toBe('abc');
});