function validate() {
  var output = $('#output');
  output.empty();

  // Parse input
  var input = $('#input').val().trim();
  var sequence = [];
  var last = -1;

  for (var match; (match = input.match(/^\[\s*([0-6])\s*:\s*([0-6])\s*\]\s*/)); input = input.substr(match[0].length)) {
    sequence.push([match[1], match[2]]);
    if (last != -1 && last != match[1]) {
      output.append($('<div class="alert alert-danger">').text("Řada kostek na sebe nenavazuje! Předchozí část končila číslem " + last + ", ale poté pokračuje následovně: " + input));
      return;
    }
    last = match[2];
  }
  if (input) {
    output.append($('<div class="alert alert-danger">').text("Nelze načíst vstup! K chybě došlo na následujícím místě vstupu: " + input));
    return;
  }

  // Aggregate domino pieces
  var pieces = {};
  for (var i in sequence) {
    var piece = sequence[i];
    var label = piece[0] < piece[1] ? piece[0]+':'+piece[1] : piece[1]+':'+piece[0];
    if (!(label in pieces)) pieces[label] = 0;
    pieces[label]++;
  }

  // Check that there are no unpermited dominos
  var dataset = datasets[$('input[name=dataset]:checked').val()];
  for (var piece in pieces) {
    if (!(piece in dataset.pieces)) {
      output.append($('<div class="alert alert-danger">').text("Kostka " + piece + " přítomná v řadě nebyla na vstupu!"));
      return;
    }
    if (pieces[piece] > dataset.pieces[piece]) {
      output.append($('<div class="alert alert-danger">').text("Kostka " + piece + " přítomná v řadě " + pieces[piece] +"x byla na vstupu pouze " + dataset.pieces[piece] + "x!"));
      return;
    }
  }

  // Great, we have a solution, print out points
  output.append($('<div class="alert alert-info">').html("Daná řada je korektní a obsahuje kostek: " + sequence.length + "<br>" +
        "Nejlepší řešení obsahuje kostek: " + dataset.length + "<br>" +
        "Získaný počet bodů tohoto řešení (na stupnici od 0 do 1): <strong>" + (sequence.length / dataset.length).toFixed(2) + "</strong>"));
}
