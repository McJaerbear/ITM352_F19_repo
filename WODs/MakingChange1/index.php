<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <?php
	//amount of pennies
	$amount = 175;

	// Get the max number of quarters
	$quarters = (int) ($amount/25);

	// Get the max number of dimes from leftover amount
    $leftover = $amount%25;
    $dimes = (int) ($leftover/10);

	// Get the max number nickles from leftover amount
    $leftover = $amount%10;
    $nickles = (int) ($leftover/5);

    // What's left will be 0-4 pennies
    $pennies = (int) ($leftover/1);

    printif('Quarters:%d Dimes:$d Nickles:%d Pennies:%d', $quarters, $dimes, $nickles, $pennies);
    ?>
</body>
</html>