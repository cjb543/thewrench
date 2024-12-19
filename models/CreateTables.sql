drop table if exists OrderStatus, AccInfo, SHFees, StockDelivery, CustSeleItems, AccCart, ShippingLocation, Payment, Account, Cart, Fees, ProdInventory, parts;

/******************************************************
The following table represents the parts entity within
the ER Diagram. This table contains instance data
regarding each product in the legacy 
product database, no inventory information.
******************************************************/

CREATE TABLE parts
(
    number INT PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(50) NOT NULL,
    price float(8,2) NOT NULL,
    weight float(4,2) NOT NULL,
    pictureURL varchar(50) NOT NULL
);


/******************************************************
The folloiwng table represents inventory data that
correlates with each product in the product legacy database.
******************************************************/

CREATE TABLE ProdInventory
(
    InventoryID INT PRIMARY KEY AUTO_INCREMENT,
    QInStock INT(4)
);


/******************************************************
The following table represents shipping and handling 
fees regarding each product in the product legacy database. 
******************************************************/

CREATE TABLE Fees
(
    FeeID INT PRIMARY KEY AUTO_INCREMENT,
    HandleCharge DECIMAL(5,2) NOT NULL,
    ShipCharge DECIMAL(5,2) NOT NULL,
    DateCreated DATE DEFAULT CURRENT_DATE
);


/******************************************************
The following table correlates with the entity Cart 
within the ER Diagram. The entity cart represents the
items associated with an account.
******************************************************/

CREATE TABLE Cart
(
    CartID INT AUTO_INCREMENT PRIMARY KEY,
    Time TIME DEFAULT CURRENT_TIME,
    Date DATE DEFAULT CURRENT_DATE
);


/******************************************************
The following table represents the entity Account. 
Each instance of an account has a AccID, Email, Password,
Phone Number, and a boolean value if its been created.
******************************************************/

CREATE TABLE Account
(
    AccID INT AUTO_INCREMENT PRIMARY KEY,   
    Email VARCHAR(35) NOT NULL,
    Password VARCHAR(16) NOT NULL,
    PhoneNum VARCHAR(15) NOT NULL,
    AccIsCreated BOOLEAN NOT NULL
);


/******************************************************
The following table represents the entity Payment.
Each instance of a payment has a Full Name, Card Number,
and an Experation Date.
******************************************************/

CREATE TABLE Payment
(
    PayID INT AUTO_INCREMENT PRIMARY KEY,
    FullName CHAR(25) NOT NULL,
    CardNum VARCHAR(20) NOT NULL,
    ExpDate VARCHAR(10) NOT NULL
);


/******************************************************
The following table represents the entity ShippingLocation.
Each shipping location has a State, City, Street Address,
and either a Apartment, Suite, Unit, Building number/name/etc.
******************************************************/

CREATE TABLE ShippingLocation
(
    ShipID INT AUTO_INCREMENT PRIMARY KEY,
    ValidState CHAR(12) NOT NULL,
    City CHAR(12) NOT NULL,
    StreetAddr VARCHAR(25) NOT NULL,
    AptSuiteUnitBuilding VARCHAR(25) NULL
);


/******************************************************
The following table represents the many to many
relationship between the entities Cart and Account.
To when the instance of this relation occurs, (a cart
is created) an each instance to when this relationship
occurs an AccountID is associated with a CartID and
creates an instance of the current time.
******************************************************/

CREATE TABLE AccCart
(
    AccID INT,
    CartID INT,
    Time TIME DEFAULT CURRENT_TIME,
    FOREIGN KEY (AccID) REFERENCES Account(AccID),
    FOREIGN KEY (CartID) REFERENCES Cart(CartID)
);


/******************************************************
The following table represents the many to many
relationship between the entities Cart and parts.
Each instance that this relationship occurs, (a customer 
selects and item) a cartid and a number(partid)
is associated.
******************************************************/

CREATE TABLE CustSeleItems
(
   CartID INT,
   number INT,
   FOREIGN KEY (CartID) REFERENCES Cart(CartID),
   FOREIGN KEY (number) REFERENCES parts(number)
);


/******************************************************
The following table represents the many to many
relationship between the entities parts and ProdInventory.
Each instance to when this relationship occurs, a number
(partid) and a InventoryID are associated and then creates
an instance of a date to when the associativity was created.
******************************************************/

CREATE TABLE StockDelivery
(
    number INT,
    InventoryID INT,
    ShipInDate VARCHAR(10) NOT NULL,
    FOREIGN KEY (number) REFERENCES parts(number),
    FOREIGN KEY (InventoryID) REFERENCES ProdInventory(InventoryID)
);


/******************************************************
The following table represents the many to many
relationship between the entities parts and Fees.
This relationship creates associativity between a number
(partid) and a FeeID. More specifically, each part is
associated with a shipping charge and a handle charge.
******************************************************/

CREATE TABLE SHFees
(
    number INT,
    FeeID INT,
    FOREIGN KEY (number) REFERENCES parts(number),
    FOREIGN KEY (FeeID) REFERENCES Fees(FeeID)
);


/******************************************************
This table represents a greater than binary relationship
between the entities Account, Payment, and
Shipping Location. When an instance of this relationship
occurs, it sets the boolean value IsCreated
to represent an account with valid information
associated with it.
******************************************************/

CREATE TABLE AccInfo
(
    AccID INT,
    PayID INT,
    ShipID INT,
    AccIsValid BOOLEAN NOT NULL,
    FOREIGN KEY (AccID) REFERENCES Account(AccID),
    FOREIGN KEY (PayID) REFERENCES Payment(PayID),
    FOREIGN KEY (ShipID) REFERENCES ShippingLocation(ShipID)
);


/******************************************************
The table below represents the entity OrderStatus which
represents an instance of a greater than binary
relattionship between the entities Account, Payment, 
and ShippingLocation. When this relationship occurs,
an instance data occurs to represent a valid transaction.
For example, time of the transaction, the date of the 
transation, if the transaction was authorized,
and if it has been shipped.
*******************************************************/

CREATE TABLE OrderStatus
(   
    AccID INT,
    PayID INT,
    ShipID INT,
    TransactionTime TIME DEFAULT CURRENT_TIME,
    CurDate DATE DEFAULT CURRENT_DATE,
    Authorized BOOLEAN NOT NULL,
    Shipped BOOLEAN NOT NULL,
    FOREIGN KEY (AccID) REFERENCES Account(AccID),
    FOREIGN KEY (PayID) REFERENCES Payment(PayID),
    FOREIGN KEY (ShipID) REFERENCES ShippingLocation(ShipID)
);
