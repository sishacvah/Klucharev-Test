//Куча глобальных переменных

var game = document.getElementById("game");
var slider = document.getElementById("slider");
var playerValue = document.getElementById("playerValue");
var groupValue = document.getElementById("groupValue");
var image = document.getElementById("image");
var compareButton = document.getElementById("compareButton");
var nextButton = document.getElementById("nextButton");
var main = document.getElementById("main");
var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];
var modalText = document.getElementById("modalText");

nextButton.disabled = true;

//Флаги окончания этапов теста
var firstRoundDone = false;
var secondRoundDone = false;

//Счетчик
var counter = 1;

//Arrays для хранения ввода пользователя и array для сравнения ("общественное мнение")
var firstValues = [];
var secondValues = [];
var groupValues = [8,1,5,3,5,7,3,7,4,5,2];
//переменная для разности ввода пользователя и "общественного мнения"
var delta;

//Метрики для результатов: сколько раз поменял мнение и коэффициент "конформности"
var numberOfChangedAnswers = 0;
var conformism = 0;

playerValue.innerHTML = slider.value;
updateGroupValue();

//Всплывающее окно в начале
modal.style.display = "block";

//Привязка слайдера к отображению значения
slider.oninput = function() {
	playerValue.innerHTML = slider.value;
};

//Убираем всплывающее окно по щелчку
span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
} 


//Сравнение оценки пользователя с "общественным"

function compare() {
	//функция сохраняет значение в array, переключает кликабельность кнопок
	savePlayerValue();
	toogleButtons();
	//проверяем, закончен ли первый этап теста
	if (!firstRoundDone){
		//вычисляем разницу, сохраняем по модулю
		delta = firstValues[counter-1] - groupValues[counter-1];
		delta = Math.abs(delta);
		//проверяем степень отклонения от "общественной"
		//красим в соответствующие цвета
		if (delta <= 2 && delta > 0) {
			groupValue.style.borderColor = "yellow";
		} else if (delta > 2){
			groupValue.style.borderColor = "red";
		} else  if (delta == 0){
			groupValue.style.borderColor = "green";
		}
		//делаем общественное мнение прозрачным (прячем от пользователя)
		toogleGroupValue();
	}
	
}

//Функция переключает прозрачность "общественного мнения". Прячет\показывает.
function toogleGroupValue() {
	if (groupValue.style.opacity == 0) {
		groupValue.style.opacity = 1;
	} else {
		groupValue.style.opacity = 0;
	}
}
//Функция переключает кликабельность кнопок
function toogleButtons() {
	if (nextButton.disabled){
		nextButton.disabled = false;
	} else {
		nextButton.disabled = true;
	}

	if (compareButton.disabled){
		compareButton.disabled = false;
	} else {
		compareButton.disabled = true;
	}
}

//Функция переводит тест к слудющему элементу (если не закончили)
function next() {
	//переключаем кнопки
	toogleButtons();
	//проверяем закончили ли первый этап, если нет, то включаем общественное значение
	if(!firstRoundDone){
		toogleGroupValue();
	}
	groupValue.style.borderColor = "white";
	//крутим счетчик
	counter++;
	//Если тест не завершен
	if (!secondRoundDone){
		//Если еще остались картинки
		if (counter < groupValues.length + 1){
			//грузим картинку (имена файлов завязаны на счетчик)
		image.src = "assets/images/image" + counter + ".jpg";
			//обновляем значение "общественного мнения"
		updateGroupValue();
		//если картинок не осталось, но всё еще первый этап
		} else if (!firstRoundDone){
			//первый этап завершен
			firstRoundDone = true;
			//всплывающее сообщение
			alert("Отлично! Для чистоты эксперимента, пожалуйста, пройдите тест снова. Но на этот раз общественное мнение будет от вас скрыто!");
			//Меняем надпись на кнопке сравнения
			compareButton.innerHTML = "Оценить!";
			//обновляем счетчик
			counter = 1;
			//загружаем изображение
			image.src = "assets/images/image" + counter + ".jpg";
			updateGroupValue();
			//прячем общественное мнение
			groupValue.style.opacity = 0;
		//если перый этап уже пройден и картинок не осталось
		} else {
			//второй этап пройден
			secondRoundDone = true;
			//Считаем метрики, показываем результат
			countDifference();
			showResults();
		}
	}
}

//Функция сохраняет значения пользователя (2 списка, по одному на каждый этап теста)
function savePlayerValue() {
	if(!firstRoundDone){
		firstValues.push(parseInt(slider.value));
	} else {
		secondValues.push(parseInt(slider.value));
	}
	
}
//обновление "общественного мнения"
function updateGroupValue() {
	groupValue.innerHTML = groupValues[counter-1];
}
//Фукция прячет тест и выводит на экран результаты
function showResults() {
	//подсчет метрик
	conformism = Math.floor(100 * numberOfChangedAnswers / groupValues.length);
	//убираем саму игру
	game.style.display = "none";

	//создаем HTML элементы и их наполнение
	var final = document.createElement('p');
	//текст
	var finalText = document.createTextNode("На самом деле данный тест показывает, насколько Вы подвержены влиянию окружающих. Все цифры были выдуманны, а фотографии взяты из интернета. Ваш уровень конформности (подверженность общественному мнению) составляет " + conformism + "%. Вы изменили своё мнение под давлением общественности " + numberOfChangedAnswers + " раз. Профессор Высшей Школы Экономики Василий Ключарев проводил исследования конформности и обнаружил нейрофизиологические механизмы, ответственные за подобное явление. Подробнее об этом можно узнать, прочитав интервью Василия Ключарева по ссылке.");
	final.appendChild(finalText);
	final.style.color = "#071223";
	//ссылка на интервью
	var a = document.createElement('a');
	a.href = "https://www.svoboda.org/a/27450266.html";
	a.innerHTML = "Узнать подробнее о конформности";
	//Фото
	var kluchImage = document.createElement('img');
	kluchImage.src = "assets/images/Kluch.jpg";
	//Подпись к фото
	var photoText = document.createElement('p');
	var photoTextContent = document.createTextNode("Фото: Василий Ключарев");
	photoText.appendChild(photoTextContent);

	//Прикрепляем элементы к body
	main.appendChild(final);
	main.appendChild(a);
	main.appendChild(kluchImage);
	main.appendChild(photoText);
}
//Функция считает разницу между первой и второй серией ответов пользователя
function countDifference() {
	var firstDelta, secondDelta;
	for (var i = 0; i < groupValues.length -1; i++){
		firstDelta = groupValues[i] - firstValues[i];
		firstDelta = Math.abs(firstDelta);

		secondDelta = groupValues[i] - secondValues[i];
		secondDelta = Math.abs(secondDelta);

		if(secondDelta < firstDelta) {
			numberOfChangedAnswers++;
		}
	}
}