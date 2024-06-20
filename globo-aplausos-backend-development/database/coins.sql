SET GLOBAL event_scheduler=ON;

DROP EVENT IF EXISTS pay_day;
CREATE EVENT IF NOT EXISTS pay_day
  ON SCHEDULE EVERY 43200 SECOND DO
		UPDATE `globoaplausos`.`Wallet`
    SET coins = 
		CASE WHEN coins + 25 > walletLimit
			THEN walletLimit
			ELSE coins + 25
		END;

SELECT * FROM `Wallet`;
