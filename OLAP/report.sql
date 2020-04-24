/**
   * REPORT 1
   * Вес поставок в зависимости от времени и поставщика
   * Измерения: Время (иерархия «Год > Месяц > День») и Поставщик
   * (иерархия «Город > Название»).
   * Мера: суммарный вес поставки
   */
select 
	EXTRACT("Year" from SP.ShipDate) AS ShipYear,
	EXTRACT("Month" from SP.ShipDate) AS ShipMonth,
	EXTRACT("Day" from SP.ShipDate) AS ShipDay,
	S.scity as SCity,
	S.sname as SName
	from delivery as SP, supplier as S
	where SP.sid = S.sid
	group by 
	cube (ShipYear, ShipMonth, ShipDay, SCity, SName)
	having 
	EXTRACT("Year" from SP.ShipDate) IS NOT NULL AND
	EXTRACT("Month" from SP.ShipDate) IS NOT NULL AND
	EXTRACT("Day" from SP.ShipDate) IS NOT NULL AND 
	S.sname IS NOT NULL AND
	S.scity IS NOT NULL;


 /**
   * REPORT 2
   * Стоимость поставок в зависимости от времени и поставщика
   * Измерения: Время (иерархия «Год > Месяц > День») и Поставщик
   * (иерархия «Город > Название»).
   * Мера: суммарная стоимость поставки.
   */
select 
	EXTRACT("Year" from SP.ShipDate) AS ShipYear,
	EXTRACT("Month" from SP.ShipDate) AS ShipMonth,
	EXTRACT("Day" from SP.ShipDate) AS ShipDay,
	S.scity as SCity,
	S.sname as SName,
	sum(SP.quatity * SP.price) as TotalPrice
	from delivery as SP, supplier as S
	where SP.sid = S.sid
	group by 
	cube (ShipYear, ShipMonth, ShipDay, SCity, SName)
	having 
	EXTRACT("Year" from SP.ShipDate) IS NOT NULL AND
	EXTRACT("Month" from SP.ShipDate) IS NOT NULL AND
	EXTRACT("Day" from SP.ShipDate) IS NOT NULL AND 
	S.sname IS NOT NULL AND
	S.scity IS NOT NULL;

 /**
   * REPORT 3
   * Стоимость поставок в зависимости от времени и весовой категории
   * поставки
   * Измерения: Время (иерархия «Год > Месяц > День») и Весовая категория
   * поставки.
   * Измерение Весовая категория поставки предполагает следующее
   * множество значений: «легкая», «средняя», «тяжелая». Указанные значения
   * назначаются в соответствии с принадлежностью веса поставки следующим
   * числовым отрезкам: (0; 100], (100; 500] и (500; 1500].
   * Мера: суммарная стоимость поставки.
   */



sselect 
	EXTRACT("Year" from SP.ShipDate) AS ShipYear,
	EXTRACT("Month" from SP.ShipDate) AS ShipMonth,
	EXTRACT("Day" from SP.ShipDate) AS ShipDay,
	CASE 
		WHEN ((select weight from detail as P where P.pid = SP.pid) * SP.quatity) > 0 AND
		((select weight from detail as P where P.pid = SP.pid) * SP.quatity) <= 100 THEN 'lightweight'
		WHEN ((select weight from detail as P where P.pid = SP.pid) * SP.quatity) > 100 AND
		((select weight from detail as P where P.pid = SP.pid) * SP.quatity) <= 500 THEN 'medium'
		WHEN ((select weight from detail as P where P.pid = SP.pid) * SP.quatity) > 500 AND
		((select weight from detail as P where P.pid = SP.pid) * SP.quatity) <= 1500 THEN 'heavyweight'
	END AS WeightCategory,
	Sum(SP.Quatity * SP.Price) as TotalPrice
from delivery as SP, supplier as S
where SP.sid = S.sid
group by 
	cube (ShipYear, ShipMonth, ShipDay, WeightCategory)
having 
    EXTRACT("Year" from SP.ShipDate) IS NOT NULL AND
    EXTRACT("Month" from SP.ShipDate) IS NOT NULL AND
    EXTRACT("Day" from SP.ShipDate) IS NOT NULL AND 
    CASE
        WHEN ((select weight from detail as P where P.pid = SP.pid) * SP.quatity) > 0 AND
        ((select weight from detail as P where P.pid = SP.pid) * SP.quatity) <= 100 THEN 'lightweight'
        WHEN ((select weight from detail as P where P.pid = SP.pid) * SP.quatity) > 100 AND
        ((select weight from detail as P where P.pid = SP.pid) * SP.quatity) <= 500 THEN 'medium'
        WHEN ((select weight from detail as P where P.pid = SP.pid) * SP.quatity) > 500 AND
        ((select weight from detail as P where P.pid = SP.pid) * SP.quatity) <= 1500 THEN 'heavyweight'
    END IS NOT  NULL;


/**
   * REPORT 4
   * Вес поставок в зависимости от времени и ценовой категории детали
   * Измерения: Время (иерархия «Год > Месяц > День») и Ценовая категория
   * детали.
   * Измерение Ценовая категория детали предполагает два значения:
   * «дешевая» (до 100 включительно), «дорогая» (более 100).
   * Мера: суммарный вес поставки.
   */


select 
	EXTRACT("Year" from SP.ShipDate) AS ShipYear,
	EXTRACT("Month" from SP.ShipDate) AS ShipMonth,
	EXTRACT("Day" from SP.ShipDate) AS ShipDay,
	CASE 
		WHEN SP.Price > 0 AND SP.Price <= 100 THEN 'cheap'
		WHEN SP.Price > 1 THEN 'expensive'
	END AS PriceCategory,
	SUM(SP.Quatity * (SELECT weight FROM Detail AS P WHERE P.pid = SP.pid)) AS TotalWeight
	from delivery as SP, supplier as S
	where SP.sid = S.sid
	group by 
	cube (ShipYear, ShipMonth, ShipDay, PriceCategory)
	having 
		EXTRACT("Year" from SP.ShipDate) IS NOT NULL AND
		EXTRACT("Month" from SP.ShipDate) IS NOT NULL AND
		EXTRACT("Day" from SP.ShipDate) IS NOT NULL AND 
		CASE 
			WHEN SP.Price > 0 AND SP.Price <= 100 THEN 'cheap'
			WHEN SP.Price > 1 THEN 'expensive'
		END IS NOT  NULL;
