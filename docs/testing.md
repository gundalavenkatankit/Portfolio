# Testing the portfolio

## Standard checks

Run the automated tests with:

```bash
npm test
```

Run code quality and production compilation checks with:

```bash
npm run lint
npm run build
```

## Shelter postal code coverage

The shelter test reads the Washington workbook and checks all 716 postal codes. It verifies that every value is unique, uses the expected five digit format, and enters the postal code geocoding path used by the application.

The default workbook path is:

```text
/Users/ankit/Downloads/washington_716_zip_codes.xlsx
```

To use a different copy, set `WASHINGTON_ZIP_WORKBOOK` before running `npm test`.

## Live service contract

Start the application, then run:

```bash
npm run test:shelters:live
```

This checks representative postal codes across Washington against the real application route, location service, and FEMA shelter service. The sample includes the cross state postal code `83856`.

The full 716 case suite is deterministic and local. The smaller live suite is intentional because public geocoding services have usage limits and live emergency data changes over time.
