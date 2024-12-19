INSERT INTO parts (description, price, weight, pictureURL) VALUES
    ('Camshaft', 420.99, 3.69, 'camshaftpiclink'),
    ('Nut', 2.99, 0.42, 'boltpiclink'),
    ('Screw', 1.99, 0.23, 'screwpiclink');

INSERT INTO ProdInventory (QInStock) VALUES
    (20),
    (30),
    (25);

INSERT INTO Fees (HandleCharge, ShipCharge, DateCreated) VALUES
    (100.00, 75.00, CURRENT_DATE),
    (2.00, 5.00, CURRENT_DATE),
    (1.50, 2.00, CURRENT_DATE);

INSERT INTO Cart (Time, Date) VALUES
    (CURRENT_TIME, CURRENT_DATE),
    (CURRENT_TIME, CURRENT_DATE);

INSERT INTO Account (Email, Password, PhoneNum, AccIsCreated) VALUES
    ('helloimunderthe@gmail.com', '1a2s3d4f5', '111-111-1111', True),
    ('waterpleasehelpme@gmail.com', '1a2s3d4f5g', '222-222-2222', True);

INSERT INTO Payment (FullName, CardNum, ExpDate) VALUES
    ('Potty the Parrot', '1111-2222-3333-4444', '4/17/2028'),
    ('Old Man Jenkins', '2222-3333-4444-5555', '8/14/2027');
    
INSERT INTO ShippingLocation (ValidState, City, StreetAddr, AptSuiteUnitBuilding) VALUES
    ('Illinois', 'Rockford', '1421 IL-2', NULL),
    ('Illinois', 'Belvidere', '514 S State St', NULL);

INSERT INTO AccCart (AccID, CartID, Time) VALUES
    (1, 1, CURRENT_TIME),
    (2, 2, CURRENT_TIME);

INSERT INTO CustSeleItems (CartID, number) VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 2),
    (2, 3),
    (2, 2);

INSERT INTO StockDelivery (number, InventoryID, ShipInDate) VALUES
    (1, 1, '2/13/2024'),
    (2, 2, '3/14/2024'),
    (3, 3, '4/15/2020');

INSERT INTO SHFees (number, FeeID) VALUES
    (1,1),
    (2,2),
    (3,3);

INSERT INTO AccInfo (AccID, PayID, ShipID, AccIsValid) VALUES
    (1, 1, 1, True),
    (2, 2, 2, True);

INSERT INTO OrderStatus (AccID, PayID, ShipID, TransactionTime, CurDate, Authorized, Shipped) VALUES
    (1, 1, 1, CURRENT_TIME, CURRENT_DATE, True, True),
    (2, 2, 2, CURRENT_TIME, CURRENT_DATE, True, True);
