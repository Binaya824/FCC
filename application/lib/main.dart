import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'features/characters/character_list_screen.dart';
import 'theme/app_theme.dart';

void main() {
  runApp(const ProviderScope(child: FccApp()));
}

class FccApp extends StatelessWidget {
  const FccApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Fantasy Character Chat',
      theme: appTheme,
      home: const CharacterListScreen(),
    );
  }
}
