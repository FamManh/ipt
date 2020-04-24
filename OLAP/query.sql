create table Supplier(
    SID integer PRIMARY KEY,
    SName char(20) not null,
    SCity char(20) not null,
    Address char(50),
    Risk integer check (Risk in (1, 2, 3)),
    unique(SName, Address, SCity)
);

create table Detail(
    PID integer PRIMARY KEY,
    PName char(20) not null,
    PCity char(20) not null,
    Color char(20),
    Weight real check(Weight > 0),
    unique(PName, PCity, Color)
);



create table Delivery(
    SPID integer PRIMARY KEY,
    SID integer,
    PID integer,
    Quatity integer check(Quatity > 0),
    Price real check(Price > 0),
    ShipDate date,
    foreign key (SID) references Supplier(SID)
        on delete cascade
        on update cascade,
    foreign key (PID) references Detail(PID)
        on delete cascade
        on update cascade
);

-----------------------------------------
create function fun_CheckDeliveryWeight()
returns trigger ass $$
declare
    --detailId integer;
    weight real;
    sum real;
begin
    --detailId = (select PID from Detail where PID = New.PID);
    weight = (select Weight from Detail where PID = New.PID);
    sum = weight * New.Quatity;
    IF (TG_OP = 'INSERT' or TG_OP = 'UPDATE') THEN
       IF (sum > 1500) THEN
            -- raise 
       END IF;
    END IF;
end;
$$ language plpgsql;

create trigger trg_CheckDeliveryWeight before insert or update on Delivery
for each row execute procedure fun_CheckDeliveryWeight();
